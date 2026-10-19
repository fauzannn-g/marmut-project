import { useState } from "react";
import { Search, Filter, Download, Trash2, Pencil } from "lucide-react";
import "./DataTable.css";

/**
 * columns: [{ key, label, render? }]
 * data: array of row objects
 * onDelete?: (row, index) => void
 * onEdit?: (row, index) => void
 * searchPlaceholder: string
 */
export default function DataTable({
  columns = [],
  data = [],
  onDelete,
  onEdit,
  searchPlaceholder = "Cari data...",
  emptyIcon,
  emptyTitle = "Belum ada data",
  emptyDescription = "Data yang ditambahkan akan muncul di sini.",
  footerLabel = "data",
  searchKeys = [],
}) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? data.filter((row) =>
        searchKeys.some((key) =>
          String(row[key] ?? "")
            .toLowerCase()
            .includes(query.toLowerCase())
        )
      )
    : data;

  return (
    <div className="datatable-card">
      {/* Toolbar */}
      <div className="datatable-toolbar">
        <div className="datatable-search">
          <Search size={17} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button className="datatable-tool-btn" type="button">
          <Filter size={16} />
          Filter
        </button>
        <button className="datatable-tool-btn" type="button">
          <Download size={16} />
          Ekspor
        </button>
      </div>

      {/* Table */}
      <div className="datatable-wrapper">
        <table className="datatable">
          <thead>
            <tr>
              <th>No.</th>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              {(onEdit || onDelete) && <th>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 2 : 1)}
                  className="datatable-empty"
                >
                  {emptyIcon && (
                    <span className="datatable-empty-icon">{emptyIcon}</span>
                  )}
                  <strong>{emptyTitle}</strong>
                  <span>{emptyDescription}</span>
                </td>
              </tr>
            ) : (
              filtered.map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row[col.key], row, index) : row[col.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td>
                      <div className="datatable-actions">
                        {onEdit && (
                          <button
                            className="action-btn edit-btn"
                            onClick={() => onEdit(row, index)}
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            className="action-btn delete-btn"
                            onClick={() => onDelete(row, index)}
                            title="Hapus"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="datatable-footer">
        Menampilkan {filtered.length} dari {data.length} {footerLabel}
      </div>
    </div>
  );
}
