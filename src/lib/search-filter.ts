export function buildSearchFilter(
  query: string,
  statusFilter: string,
  searchFields: string[]
) {
  const where: any = {};

  if (query) {
    where.OR = searchFields.map((field) => ({
      [field]: { contains: query, mode: "insensitive" },
    }));
  }

  if (statusFilter === "ativos") where.ativo = true;
  if (statusFilter === "inativos") where.ativo = false;

  return where;
}
