"use client";

import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Search } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

type SortValue = string | number | boolean | Date | null | undefined;

export type DataTableColumn<T> = {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  sortValue?: (row: T) => SortValue;
  searchValue?: (row: T) => unknown;
  className?: string;
};

export type DataTableProps<T> = {
  rows: readonly T[];
  columns: readonly DataTableColumn<T>[];
  getRowId: (row: T) => string;
  getRowHref?: (row: T) => string | undefined;
  searchPlaceholder?: string;
  empty?: ReactNode;
  pageSize?: number;
  pageSizeOptions?: readonly number[];
  initialSort?: { columnId: string; direction?: "asc" | "desc" };
  ariaLabel?: string;
};

function normalizeSortValue(value: SortValue): string | number {
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return Number.isNaN(value) ? 0 : value;
  if (typeof value === "boolean") return value ? 1 : 0;
  return String(value ?? "").toLocaleLowerCase();
}

export function DataTable<T>({
  rows,
  columns,
  getRowId,
  getRowHref,
  searchPlaceholder = "Search…",
  empty = "No records found.",
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 25, 50],
  initialSort,
  ariaLabel = "Data table",
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sort, setSort] = useState(initialSort);

  const filteredRows = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return [...rows];
    return rows.filter((row) =>
      columns.some((column) => {
        const value = column.searchValue?.(row) ?? column.sortValue?.(row);
        return value != null && String(value).toLocaleLowerCase().includes(needle);
      }),
    );
  }, [columns, query, rows]);

  const sortedRows = useMemo(() => {
    if (!sort) return filteredRows;
    const column = columns.find((candidate) => candidate.id === sort.columnId);
    if (!column?.sortValue) return filteredRows;
    const direction = sort.direction === "desc" ? -1 : 1;
    return [...filteredRows].sort((left, right) => {
      const a = normalizeSortValue(column.sortValue!(left));
      const b = normalizeSortValue(column.sortValue!(right));
      return (typeof a === "number" && typeof b === "number"
        ? a - b
        : String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" })) * direction;
    });
  }, [columns, filteredRows, sort]);

  const pageCount = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  useEffect(() => setPage(1), [pageSize, query]);
  useEffect(() => setPage((current) => Math.min(current, pageCount)), [pageCount]);
  const visibleRows = sortedRows.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(column: DataTableColumn<T>) {
    if (!column.sortValue) return;
    setSort((current) =>
      current?.columnId === column.id
        ? { columnId: column.id, direction: current.direction === "asc" ? "desc" : "asc" }
        : { columnId: column.id, direction: "asc" },
    );
  }

  return (
    <section className="st-data-table">
      <div className="st-toolbar">
        <label className="st-search">
          <Search size={15} aria-hidden />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={searchPlaceholder} />
        </label>
        <span className="st-data-table-count">{filteredRows.length} records</span>
      </div>
      <div className="st-table-wrap">
        <table className="st-table st-data-table-grid" aria-label={ariaLabel}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.id} className={column.className}>
                  {column.sortValue ? (
                    <button type="button" className="st-table-sort" onClick={() => toggleSort(column)}>
                      {column.header}
                      {sort?.columnId === column.id
                        ? sort.direction === "desc" ? <ChevronDown size={14} /> : <ChevronUp size={14} />
                        : null}
                    </button>
                  ) : column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => {
              const href = getRowHref?.(row);
              return (
                <tr key={getRowId(row)} className={href ? "st-table-row-link" : undefined}>
                  {columns.map((column, index) => (
                    <td key={column.id} className={column.className}>
                      {href && index === 0 ? <Link href={href}>{column.cell(row)}</Link> : column.cell(row)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {visibleRows.length === 0 ? <div className="st-state st-data-table-empty">{empty}</div> : null}
      <footer className="st-data-table-pagination">
        <label className="st-label">
          <span>Rows per page</span>
          <select className="st-select" value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}>
            {pageSizeOptions.map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
        <span>Page {page} of {pageCount}</span>
        <div className="st-row">
          <button className="st-icon-btn" type="button" disabled={page === 1} onClick={() => setPage((value) => value - 1)} aria-label="Previous page"><ChevronLeft size={16} /></button>
          <button className="st-icon-btn" type="button" disabled={page === pageCount} onClick={() => setPage((value) => value + 1)} aria-label="Next page"><ChevronRight size={16} /></button>
        </div>
      </footer>
    </section>
  );
}
