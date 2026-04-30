/**
 * 한국 이름의 특징(성씨 공유, 돌림자 등)을 고려하여 
 * 여러 명의 아기 이름 중 서로 다른 부분만 추출하여 반환합니다.
 */
export function getShortUniqueNames(allNames: string[]): Record<string, string> {
  if (allNames.length <= 1) {
    const result: Record<string, string> = {};
    if (allNames.length === 1) result[allNames[0]] = allNames[0];
    return result;
  }

  // 모든 이름의 글자 위치별로 동일 여부 체크
  const maxLen = Math.max(...allNames.map(n => n.length));
  const isIdenticalAtIndex: boolean[] = [];
  
  for (let i = 0; i < maxLen; i++) {
    const chars = allNames.map(name => name[i]);
    const uniqueChars = new Set(chars);
    // 해당 위치의 글자가 모든 이름에서 동일한지 확인
    isIdenticalAtIndex[i] = uniqueChars.size === 1;
  }

  const results: Record<string, string> = {};
  allNames.forEach(name => {
    let shortName = "";
    for (let i = 0; i < name.length; i++) {
      // 서로 다른 글자만 추출
      if (!isIdenticalAtIndex[i]) {
        shortName += name[i];
      }
    }
    
    // 만약 모든 글자가 동일하거나(중복 이름), 결과가 비어있으면 전체 이름 반환
    results[name] = shortName || name;
  });

  return results;
}
