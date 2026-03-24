
import './PageControl.css';

export default function PageControl({
  pageNumber,
  pageSize,
  pageItemCount,
  canPrevious,
  canNext,
  isLoading,
  onPrevious,
  onNext,
  onPageSizeChange,
}) {
  return (
    <section className="pagination-control">
      <h3 className="pagination-title">Pages</h3>
      <div className="pagination-row">
        <label htmlFor="page-size">Page Size</label>
        <select
          id="page-size"
          className="pagination-select"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          disabled={isLoading}
        >
          <option value={20}>20</option>
          <option value={40}>40</option>
          <option value={60}>60</option>
          <option value={100}>100</option>
        </select>
      </div>

      <div className="pagination-status">
        <span>Page {pageNumber}</span>
        <span>{pageItemCount} records</span>
      </div>

      <div className="pagination-actions">
        <button type="button" onClick={onPrevious} disabled={!canPrevious || isLoading}>
          Previous
        </button>
        <button type="button" onClick={onNext} disabled={!canNext || isLoading}>
          Next
        </button>
      </div>
    </section>
  );
}