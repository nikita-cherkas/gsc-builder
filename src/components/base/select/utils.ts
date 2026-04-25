export function sortAndStringify(sortable: any) {
  const ordered: any = {}

  Object.keys(sortable)
    .sort()
    .forEach((key) => {
      ordered[key] = sortable[key]
    })

  return JSON.stringify(ordered)
}
