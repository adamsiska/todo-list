import React from 'react'
import './filter-buttons.css'

type FilterType = 'all' | 'active' | 'completed'

interface FilterButtonsProps {
  currentFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  completedCount: number
  activeCount: number
  onCompleteAll: () => void
  onDeleteCompleted: () => void
}

const FilterButtons: React.FC<FilterButtonsProps> = ({
  currentFilter,
  onFilterChange,
  completedCount,
  activeCount,
  onCompleteAll,
  onDeleteCompleted
}) => {
  return (
    <div className="filter-controls">
      <div className="filter-buttons">
        <button
          className={`filter-button ${currentFilter === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          Všechny
        </button>
        <button
          className={`filter-button ${currentFilter === 'active' ? 'active' : ''}`}
          onClick={() => onFilterChange('active')}
        >
          Aktivní
        </button>
        <button
          className={`filter-button ${currentFilter === 'completed' ? 'active' : ''}`}
          onClick={() => onFilterChange('completed')}
        >
          Dokončené
        </button>
      </div>

      <div className="bulk-actions">
        {activeCount > 0 && (
          <button
            className="bulk-button complete-all"
            onClick={onCompleteAll}
          >
            Označit všechny
          </button>
        )}
        {completedCount > 0 && (
          <button
            className="bulk-button delete-completed"
            onClick={onDeleteCompleted}
          >
            Odstranit dokončené
          </button>
        )}
      </div>

      <div className="todo-stats">
        Aktivní: {activeCount} | Dokončené: {completedCount}
      </div>
    </div>
  )
}

export default FilterButtons
