/**
 * 주어진 URL 경로에 쿼리 파라미터를 추가하거나 업데이트합니다.
 *
 * @param basePath 기본 URL 경로. 기존 쿼리 스트링을 포함할 수 있습니다.
 * @param paramsToAdd 추가하거나 덮어쓸 쿼리 파라미터 객체.
 *                    값이 null 또는 undefined이면 해당 파라미터는 제거됩니다.
 * @returns 쿼리 파라미터가 적용된 새로운 URL 문자열.
 */
export const makeURLQueries = (
  basePath: string,
  paramsToAdd: Record<
    string,
    | string
    | number
    | boolean
    | null
    | undefined
    | Array<string | number | boolean>
  >
): string => {
  const [path, queryString = ""] = basePath.split("?");
  const searchParams = new URLSearchParams(queryString);

  // paramsToAdd 객체의 각 키-값 쌍을 처리
  Object.entries(paramsToAdd).forEach(([key, value]) => {
    // 기존 파라미터 삭제 (덮어쓰기 및 null/undefined 처리를 위해)
    searchParams.delete(key);

    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        // 값이 배열이면 각 요소를 동일한 키로 추가
        value.forEach((v) => searchParams.append(key, String(v)));
      } else {
        // 배열이 아니면 단일 값으로 설정
        searchParams.set(key, String(value));
      }
    }
  });

  const newQueryString = searchParams.toString();
  return newQueryString ? `${path}?${newQueryString}` : path;
};
