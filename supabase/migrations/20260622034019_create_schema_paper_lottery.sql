-- Paper lottery schema (app_paper_lottery)

CREATE SCHEMA IF NOT EXISTS app_paper_lottery;

GRANT USAGE ON SCHEMA app_paper_lottery TO service_role, authenticator;

-- boards
CREATE TABLE app_paper_lottery.boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  short_code TEXT NOT NULL UNIQUE,
  admin_token TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  slot_count INTEGER NOT NULL CHECK (slot_count >= 6 AND slot_count <= 120),
  prize_config JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  revealed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_boards_short_code ON app_paper_lottery.boards (short_code);

-- participants
CREATE TABLE app_paper_lottery.participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES app_paper_lottery.boards (id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  pick_quota INTEGER NOT NULL CHECK (pick_quota >= 1),
  picks_used INTEGER NOT NULL DEFAULT 0 CHECK (picks_used >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_participants_board_id ON app_paper_lottery.participants (board_id);
CREATE INDEX idx_participants_token ON app_paper_lottery.participants (token);

-- slots
CREATE TABLE app_paper_lottery.slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES app_paper_lottery.boards (id) ON DELETE CASCADE,
  slot_index INTEGER NOT NULL CHECK (slot_index >= 0),
  prize_label TEXT NOT NULL,
  picked_by UUID REFERENCES app_paper_lottery.participants (id),
  picked_at TIMESTAMPTZ,
  UNIQUE (board_id, slot_index)
);

CREATE INDEX idx_slots_board_id ON app_paper_lottery.slots (board_id);

-- picks (history)
CREATE TABLE app_paper_lottery.picks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES app_paper_lottery.participants (id) ON DELETE CASCADE,
  slot_id UUID NOT NULL REFERENCES app_paper_lottery.slots (id) ON DELETE CASCADE,
  prize_label TEXT NOT NULL,
  picked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_picks_participant_id ON app_paper_lottery.picks (participant_id);

-- RLS: no anon/authenticated policies — service role only
ALTER TABLE app_paper_lottery.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_paper_lottery.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_paper_lottery.slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_paper_lottery.picks ENABLE ROW LEVEL SECURITY;

GRANT ALL ON ALL TABLES IN SCHEMA app_paper_lottery TO service_role, authenticator;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA app_paper_lottery TO service_role, authenticator;

-- pick_slot RPC
CREATE OR REPLACE FUNCTION app_paper_lottery.pick_slot(
  p_participant_token TEXT,
  p_slot_index INTEGER
)
RETURNS TABLE (prize_label TEXT, revealed BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = app_paper_lottery
AS $$
DECLARE
  v_participant app_paper_lottery.participants%ROWTYPE;
  v_board app_paper_lottery.boards%ROWTYPE;
  v_slot app_paper_lottery.slots%ROWTYPE;
  v_total_quota INTEGER;
  v_total_used INTEGER;
  v_revealed BOOLEAN := FALSE;
BEGIN
  SELECT * INTO v_participant
  FROM app_paper_lottery.participants
  WHERE token = p_participant_token
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'invalid_participant_token';
  END IF;

  IF v_participant.picks_used >= v_participant.pick_quota THEN
    RAISE EXCEPTION 'quota_exceeded';
  END IF;

  SELECT * INTO v_board
  FROM app_paper_lottery.boards
  WHERE id = v_participant.board_id
  FOR UPDATE;

  IF v_board.expires_at < NOW() THEN
    RAISE EXCEPTION 'board_expired';
  END IF;

  IF v_board.revealed_at IS NOT NULL THEN
    RAISE EXCEPTION 'board_revealed';
  END IF;

  IF v_board.status = 'closed' THEN
    RAISE EXCEPTION 'board_closed';
  END IF;

  SELECT * INTO v_slot
  FROM app_paper_lottery.slots
  WHERE board_id = v_board.id AND slot_index = p_slot_index
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'invalid_slot_index';
  END IF;

  IF v_slot.picked_by IS NOT NULL THEN
    RAISE EXCEPTION 'slot_taken';
  END IF;

  UPDATE app_paper_lottery.slots
  SET picked_by = v_participant.id, picked_at = NOW()
  WHERE id = v_slot.id;

  INSERT INTO app_paper_lottery.picks (participant_id, slot_id, prize_label)
  VALUES (v_participant.id, v_slot.id, v_slot.prize_label);

  UPDATE app_paper_lottery.participants
  SET picks_used = picks_used + 1
  WHERE id = v_participant.id;

  SELECT COALESCE(SUM(pick_quota), 0), COALESCE(SUM(picks_used), 0)
  INTO v_total_quota, v_total_used
  FROM app_paper_lottery.participants
  WHERE board_id = v_board.id;

  IF v_total_used >= v_total_quota THEN
    UPDATE app_paper_lottery.boards
    SET revealed_at = NOW(), status = 'closed'
    WHERE id = v_board.id;
    v_revealed := TRUE;
  END IF;

  prize_label := v_slot.prize_label;
  revealed := v_revealed;
  RETURN NEXT;
END;
$$;

GRANT EXECUTE ON FUNCTION app_paper_lottery.pick_slot(TEXT, INTEGER) TO service_role, authenticator;
