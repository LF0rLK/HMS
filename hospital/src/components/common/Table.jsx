export const Table = ({ columns = [], data = [], emptyMessage = 'No data found.', actions }) => (
  /* Outer wrapper clips the border-radius; inner div enables horizontal scroll on small screens */
  <div className="bg-bg-primary border border-border rounded-lg overflow-hidden shadow-sm">
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full text-left border-collapse min-w-[560px]">
        <thead>
          <tr className="bg-surface border-b border-border select-none">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-caption font-bold text-text-secondary uppercase tracking-wider whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
            {actions && (
              <th className="px-4 py-3 text-caption font-bold text-text-secondary uppercase tracking-wider text-right whitespace-nowrap">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="px-4 py-12 text-center text-body-sm text-text-secondary"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={row._id || row.id || i}
                className="border-b border-divider hover:bg-surface/60 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-body-sm text-text-primary">
                    {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">{actions(row)}</div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);
