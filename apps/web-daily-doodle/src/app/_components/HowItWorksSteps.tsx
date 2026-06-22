const steps = [
  { step: "①", title: "닉네임 정하기", body: "가입 없이 닉네임만 입력하면 바로 시작" },
  { step: "②", title: "함께 그리기", body: "같은 캔버스에 펜과 텍스트로 낙서" },
  { step: "③", title: "자정에 아카이브", body: "매일 밤 낙서가 지난 낙서로 저장" },
];

export const HowItWorksSteps = () => {
  return (
    <section className="space-y-3 py-6">
      <h2 className="text-ink text-center text-lg font-bold">이렇게 사용해요</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {steps.map((item) => (
          <article key={item.step} className="paper-surface rounded-xl border border-[#e8dfc8] p-4 text-center shadow-sm">
            <p className="text-accent mb-1 text-lg font-bold">{item.step}</p>
            <h3 className="text-ink text-sm font-semibold">{item.title}</h3>
            <p className="text-ink/65 mt-1 text-xs leading-relaxed">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
