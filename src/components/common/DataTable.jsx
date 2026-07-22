import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsUpDown,
  DownloadCloud,
  Filter,
  LayoutGrid,
  List,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  UploadCloud,
  X
} from 'lucide-react';

export default function DataTable({
  columns,
  data,
  pageSize: initialPageSize = 10,
  onRowClick,
  emptyMessage = 'No data available',
  loading = false,
  searchPlaceholder = 'Search',
  primaryActionLabel = 'Add',
  onPrimaryAction,
  showToolbar = true,
  showSelection = true,
  filterOptions = [],
  // Action callbacks
  onRowView,
  onRowEdit,
  onRowDelete,
  onBulkEdit,
  onBulkExport,
  onBulkDelete,
  // Server-side props
  serverSide = false,
  totalItems = 0,
  onPageChange,
  onSearch,
  onSort,
  onFilterChange
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState(() => new Set());
  const [activeFilterKey, setActiveFilterKey] = useState(null);
  const [activeFilterValue, setActiveFilterValue] = useState('ALL');
  const [openMenu, setOpenMenu] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [activeActionRow, setActiveActionRow] = useState(null);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [localQuery, setLocalQuery] = useState('');

  // Debounced search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(localQuery);
      if (localQuery !== query) {
        setCurrentPage(1);
        if (serverSide && onSearch) onSearch(localQuery);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [localQuery, serverSide, onSearch, query]);

  const availableFilters = useMemo(() => {
    if (filterOptions.length > 0) return filterOptions;

    return columns
      .filter((col) => col.filterable !== false && col.key)
      .map((col) => {
        const uniqueValues = Array.from(
          new Set(
            data
              .map((item) => item[col.key])
              .filter((val) => val !== undefined && val !== null && val !== '')
          )
        );

        return {
          key: col.key,
          label: col.label,
          options: uniqueValues.map((v) => ({ label: String(v), value: String(v) }))
        };
      })
      .filter((f) => f.options.length > 0);
  }, [columns, data, filterOptions]);

  const activeFilterConfig = useMemo(() => (
    availableFilters.find((f) => f.key === activeFilterKey) || availableFilters[0]
  ), [availableFilters, activeFilterKey]);

  const filteredData = useMemo(() => {
    if (serverSide) return data;

    let result = data;

    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery) {
      result = result.filter((row) => (
        columns.some((column) => String(row[column.key] ?? '').toLowerCase().includes(normalizedQuery))
      ));
    }

    if (activeFilterConfig && activeFilterValue !== 'ALL') {
      result = result.filter((row) => (
        String(row[activeFilterConfig.key] ?? '') === activeFilterValue
      ));
    }

    return result;
  }, [data, query, columns, activeFilterConfig, activeFilterValue, serverSide]);

  const sortedData = useMemo(() => {
    if (serverSide) return filteredData;
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig, serverSide]);

  const paginatedData = useMemo(() => {
    if (serverSide) return sortedData;
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, serverSide]);

  const actualTotalItems = serverSide ? totalItems : sortedData.length;
  const actualTotalPages = Math.max(1, Math.ceil(actualTotalItems / pageSize));
  
  const allVisibleSelected = paginatedData.length > 0 && paginatedData.every((row, index) => selectedRows.has(row.id ?? `${currentPage}-${index}`));

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
    if (serverSide && onSort) onSort(key, direction);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronsUpDown className="w-3.5 h-3.5 text-stone-300" />;
    }
    return sortConfig.direction === 'asc'
      ? <ChevronUp className="w-3.5 h-3.5 text-stone-600" />
      : <ChevronDown className="w-3.5 h-3.5 text-stone-600" />;
  };

  const toggleRow = (rowId) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  };

  const toggleVisibleRows = () => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      paginatedData.forEach((row, index) => {
        const rowId = row.id ?? `${currentPage}-${index}`;
        if (allVisibleSelected) next.delete(rowId);
        else next.add(rowId);
      });
      return next;
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (serverSide && onPageChange) onPageChange(newPage);
  };

  return (
    <div className="bg-white border border-stone-100 rounded-[14px] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] font-sans relative">
      {/* Invisible overlay to close dropdowns when clicking outside */}
      {(openMenu || activeActionRow) && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={(e) => {
            e.stopPropagation();
            setOpenMenu(null);
            setActiveActionRow(null);
          }}
        />
      )}
      
      
      {selectedRows.size > 0 ? (
        <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between bg-orange-50/60 transition-all">
          <div className="flex items-center gap-4">
            <div className="text-sm font-bold text-orange-700">
              {selectedRows.size} item{selectedRows.size > 1 ? 's' : ''} selected
            </div>
            <div className="w-px h-5 bg-orange-200/60 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-3">
              <button onClick={() => onBulkEdit && onBulkEdit(Array.from(selectedRows))} className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">Edit</button>
              <button onClick={() => onBulkExport && onBulkExport(Array.from(selectedRows))} className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">Export</button>
              <button onClick={() => onBulkDelete && onBulkDelete(Array.from(selectedRows))} className="text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors">Delete</button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="sm:hidden flex items-center gap-2 mr-2">
               <button className="text-sm font-medium text-stone-600">Actions...</button>
            </div>
            <button 
              onClick={() => setSelectedRows(new Set())}
              className="text-sm font-medium text-stone-500 hover:text-stone-700 transition-colors bg-white/60 hover:bg-white px-3 py-1.5 rounded-lg border border-stone-200/60"
            >
              Clear
            </button>
          </div>
        </div>
      ) : showToolbar && (
        <div className="px-4 py-3 border-b border-stone-100 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={localQuery}
                onChange={(event) => {
                  setLocalQuery(event.target.value);
                }}
                placeholder={searchPlaceholder}
                className="w-full sm:w-64 pl-9 pr-3 py-2 text-sm bg-stone-100/80 border border-transparent rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-300 text-stone-700 placeholder-stone-500"
              />
            </div>

            {/* Filter Dropdown */}
            {availableFilters.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenMenu((prev) => (prev === 'filter' ? null : 'filter'))}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border rounded-lg transition-colors ${
                    activeFilterValue !== 'ALL'
                      ? 'bg-orange-50 border-orange-200 text-orange-700'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Filter className="w-4 h-4 text-stone-500" />
                  <span>
                    {activeFilterConfig ? activeFilterConfig.label : 'Filter'}
                    {activeFilterValue !== 'ALL' && `: ${activeFilterValue}`}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {openMenu === 'filter' && (
                  <div className="absolute left-0 top-full mt-1.5 w-56 bg-white border border-stone-200 rounded-xl shadow-lg z-20 p-2 text-xs">
                    <div className="mb-2 pb-2 border-b border-stone-100 px-2 font-semibold text-stone-500">
                      Filter Field
                    </div>
                    <div className="space-y-1 mb-2">
                      {availableFilters.map((f) => (
                        <button
                          key={f.key}
                          type="button"
                          onClick={() => {
                            setActiveFilterKey(f.key);
                            setActiveFilterValue('ALL');
                            if (serverSide && onFilterChange) onFilterChange(f.key, 'ALL');
                          }}
                          className={`w-full text-left px-2 py-1.5 rounded-md flex items-center justify-between ${
                            (activeFilterConfig?.key === f.key) ? 'bg-stone-100 font-semibold text-stone-900' : 'text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          <span>{f.label}</span>
                          {(activeFilterConfig?.key === f.key) && <Check className="w-3.5 h-3.5 text-orange-600" />}
                        </button>
                      ))}
                    </div>

                    {activeFilterConfig && (
                      <>
                        <div className="mb-1 pt-2 border-t border-stone-100 px-2 font-semibold text-stone-500">
                          Value
                        </div>
                        <div className="max-h-40 overflow-y-auto space-y-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveFilterValue('ALL');
                              setOpenMenu(null);
                              if (serverSide && onFilterChange) onFilterChange(activeFilterKey, 'ALL');
                            }}
                            className={`w-full text-left px-2 py-1 rounded-md ${activeFilterValue === 'ALL' ? 'bg-orange-50 text-orange-700 font-semibold' : 'text-stone-600 hover:bg-stone-50'}`}
                          >
                            All ({activeFilterConfig.label})
                          </button>
                          {activeFilterConfig.options.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                setActiveFilterValue(opt.value);
                                setOpenMenu(null);
                                if (serverSide && onFilterChange) onFilterChange(activeFilterKey, opt.value);
                              }}
                              className={`w-full text-left px-2 py-1 rounded-md ${activeFilterValue === opt.value ? 'bg-orange-50 text-orange-700 font-semibold' : 'text-stone-600 hover:bg-stone-50'}`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu((prev) => (prev === 'sort' ? null : 'sort'))}
                className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors border border-stone-200"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
              {openMenu === 'sort' && (
                <div className="absolute left-0 top-full mt-1.5 w-48 bg-white border border-stone-200 rounded-xl shadow-lg z-20 p-2 text-xs">
                  <div className="mb-2 pb-2 border-b border-stone-100 px-2 font-semibold text-stone-500">
                    Sort By Column
                  </div>
                  {columns.map((col) => (
                    <button
                      key={col.key}
                      type="button"
                      onClick={() => {
                        handleSort(col.key);
                        setOpenMenu(null);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-md flex items-center justify-between text-stone-600 hover:bg-stone-50"
                    >
                      <span>{col.label}</span>
                      {sortConfig.key === col.key && (
                        <span className="text-[10px] font-bold text-orange-600 uppercase">
                          {sortConfig.direction}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear Filters indicator */}
            {(activeFilterValue !== 'ALL' || query) && (
              <button
                type="button"
                onClick={() => {
                  setLocalQuery('');
                  setQuery('');
                  setActiveFilterValue('ALL');
                  if (serverSide && onSearch) onSearch('');
                  if (serverSide && onFilterChange) onFilterChange(activeFilterKey, 'ALL');
                }}
                className="flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-stone-800 p-1.5 rounded-md"
              >
                <X className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <div className="hidden sm:flex items-center gap-1 text-stone-500 mr-1 bg-stone-100/50 p-1 rounded-lg border border-stone-200/60">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white text-stone-900 shadow-sm border border-stone-200' : 'text-stone-500 hover:text-stone-700'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white text-stone-900 shadow-sm border border-stone-200' : 'text-stone-500 hover:text-stone-700'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-lg transition-colors whitespace-nowrap">
              <UploadCloud className="w-4 h-4 text-stone-500" />
              Import
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-lg transition-colors whitespace-nowrap">
              <DownloadCloud className="w-4 h-4 text-stone-500" />
              Export
            </button>
            <button
              type="button"
              onClick={onPrimaryAction}
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              {primaryActionLabel}
            </button>
          </div>
        </div>
      )}

      {viewMode === 'list' ? (
      <div className="overflow-x-auto relative">
        {loading && (
          <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
          </div>
        )}
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-stone-100">
              {showSelection && (
                <th className="w-10 px-4 py-3 text-left">
                  <button
                    type="button"
                    onClick={toggleVisibleRows}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      allVisibleSelected ? 'bg-orange-500 border-orange-500 text-white' : 'bg-stone-100 border-stone-100 text-transparent hover:border-stone-300'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-[11px] font-medium text-stone-400 uppercase tracking-[0.12em] ${column.sortable !== false ? 'cursor-pointer hover:text-stone-700' : ''}`}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {column.label}
                    {column.sortable !== false && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
              <th className="w-12 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (showSelection ? 2 : 1)} className="px-4 py-10 text-center text-sm text-stone-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => {
                const rowId = row.id ?? `${currentPage}-${index}`;
                const selected = selectedRows.has(rowId);

                return (
                  <tr
                    key={rowId}
                    className={`${onRowClick ? 'cursor-pointer' : ''} border-b border-stone-100 last:border-b-0 hover:bg-stone-50/70 transition-colors`}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    {showSelection && (
                      <td className="px-4 py-4 align-middle" onClick={(event) => event.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => toggleRow(rowId)}
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            selected ? 'bg-orange-500 border-orange-500 text-white' : 'bg-stone-100 border-stone-100 text-transparent hover:border-stone-300'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </td>
                    )}
                    {columns.map((column) => (
                      <td key={column.key} className="px-4 py-4 text-sm text-stone-600 whitespace-nowrap align-middle">
                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                      </td>
                    ))}
                    <td className="px-4 py-4 align-middle">
                      <div className="relative flex justify-end">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setActiveActionRow(activeActionRow === rowId ? null : rowId); }}
                          className="p-1 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors relative z-20"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {activeActionRow === rowId && (
                          <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-stone-200 rounded-xl shadow-lg z-30 p-1.5 text-xs font-medium" onClick={e => e.stopPropagation()}>
                             <button onClick={() => { setActiveActionRow(null); onRowView && onRowView(row); }} className="w-full text-left px-3 py-2 rounded-md hover:bg-stone-50 text-stone-700 transition-colors">View Details</button>
                             <button onClick={() => { setActiveActionRow(null); onRowEdit && onRowEdit(row); }} className="w-full text-left px-3 py-2 rounded-md hover:bg-stone-50 text-stone-700 transition-colors">Edit Record</button>
                             <div className="h-px bg-stone-100 my-1 mx-1"></div>
                             <button onClick={() => { setActiveActionRow(null); onRowDelete && onRowDelete(row); }} className="w-full text-left px-3 py-2 rounded-md hover:bg-rose-50 text-rose-600 transition-colors">Delete</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>) : (
        <div className="p-4 bg-stone-50/50 border-b border-stone-100 relative">
          {loading && (
            <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
            </div>
          )}
          {paginatedData.length === 0 ? (
            <div className="py-10 text-center text-sm text-stone-500">
              {emptyMessage}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedData.map((row, index) => {
                const rowId = row.id ?? `${currentPage}-${index}`;
                const selected = selectedRows.has(rowId);
                return (
                  <div 
                    key={rowId} 
                    className={`relative bg-white p-5 rounded-xl border transition-all ${onRowClick ? 'cursor-pointer hover:border-orange-300 hover:shadow-md' : 'hover:border-stone-300 hover:shadow-sm'} ${selected ? 'border-orange-500 ring-1 ring-orange-500' : 'border-stone-200'}`}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    <div className="absolute top-5 right-5 z-20">
                      <div className="relative">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setActiveActionRow(activeActionRow === rowId ? null : rowId); }}
                          className="p-1 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors bg-white/80 backdrop-blur-sm shadow-2xs"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        {activeActionRow === rowId && (
                          <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-stone-200 rounded-xl shadow-lg z-30 p-1.5 text-xs font-medium" onClick={e => e.stopPropagation()}>
                             <button onClick={() => { setActiveActionRow(null); onRowView && onRowView(row); }} className="w-full text-left px-3 py-2 rounded-md hover:bg-stone-50 text-stone-700 transition-colors">View Details</button>
                             <button onClick={() => { setActiveActionRow(null); onRowEdit && onRowEdit(row); }} className="w-full text-left px-3 py-2 rounded-md hover:bg-stone-50 text-stone-700 transition-colors">Edit Record</button>
                             <div className="h-px bg-stone-100 my-1 mx-1"></div>
                             <button onClick={() => { setActiveActionRow(null); onRowDelete && onRowDelete(row); }} className="w-full text-left px-3 py-2 rounded-md hover:bg-rose-50 text-rose-600 transition-colors">Delete</button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-start mb-4 pr-10">
                       {/* Render the first column as the primary header of the card */}
                       {columns.length > 0 && (
                         <div className="w-full">
                           {columns[0].render ? columns[0].render(row[columns[0].key], row) : <div className="font-bold text-stone-900">{row[columns[0].key]}</div>}
                         </div>
                       )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-4 gap-x-3 pt-4 border-t border-stone-100">
                      {columns.slice(1).map((column) => {
                        // Skip rendering empty columns or columns that don't have visual content (like hidden email)
                        const content = column.render ? column.render(row[column.key], row) : row[column.key];
                        if (content === null || content === undefined || content === '') return null;
                        
                        return (
                          <div key={column.key} className="flex flex-col gap-1.5 col-span-1">
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{column.label}</span>
                            <div className="text-sm text-stone-700">{content}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {actualTotalPages > 1 && (
        <div className="px-5 py-3 border-t border-stone-100 bg-stone-50/50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-b-[14px]">
          <div className="flex items-center gap-4">
            <div className="text-xs text-stone-500 font-medium">
              Showing <span className="font-bold text-stone-900">{((currentPage - 1) * pageSize) + 1}</span> to <span className="font-bold text-stone-900">{Math.min(currentPage * pageSize, actualTotalItems)}</span> of <span className="font-bold text-stone-900">{actualTotalItems}</span> results
            </div>
            
            <div className="hidden sm:flex items-center gap-2 border-l border-stone-200 pl-4">
              <span className="text-[11px] text-stone-500 font-medium uppercase tracking-wider">Rows per page:</span>
              <select 
                value={pageSize}
                onChange={(e) => {
                   setPageSize(Number(e.target.value));
                   setCurrentPage(1);
                   if (serverSide && onPageChange) onPageChange(1);
                }}
                className="text-xs font-bold text-stone-700 bg-transparent border-none focus:ring-0 cursor-pointer p-0"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || loading}
              className="px-3 py-1.5 text-[11px] font-bold border border-stone-200 rounded-md bg-white transition-colors shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed disabled:text-stone-400 text-stone-700 hover:bg-stone-50"
            >
              Previous
            </button>
            <div className="hidden sm:flex items-center gap-0.5 px-2">
              {Array.from({ length: actualTotalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  disabled={loading}
                  className={`min-w-[28px] px-2 py-1.5 text-[11px] font-bold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${page === currentPage ? 'bg-stone-200/50 text-stone-900' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700'}`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(Math.min(actualTotalPages, currentPage + 1))}
              disabled={currentPage === actualTotalPages || loading}
              className="px-3 py-1.5 text-[11px] font-bold border border-stone-200 rounded-md bg-white transition-colors shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed disabled:text-stone-400 text-stone-700 hover:bg-stone-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
