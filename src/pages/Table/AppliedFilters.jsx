import componentStyles from './TableModalComponents.module.css';

function AppliedFilters({ appliedFilters, setFilter, showCities, showYears, showSections, showRows, showColumns, setModalActive }){
    const handleFilter = (filterId,showFn)=>{
        setFilter(filterId);
        showFn();
        setModalActive(true);
    }
     const hasFilters =
    appliedFilters.cities.length > 0 ||
    appliedFilters.years.length > 0 ||
    appliedFilters.sections.length > 0 ||
    appliedFilters.rows.length > 0 ||
    appliedFilters.columns.length > 0;
    if (!hasFilters) return null;
    return (
              <div className={componentStyles.activeFilters}>
                <h4>Применённые фильтры:</h4>
                <ul className={componentStyles.filtersList}>
                  {appliedFilters.cities.length > 0 && (
                    <li className={componentStyles.filterTag} onClick={() => handleFilter(1,showCities)}>
                      <strong>Субъекты:</strong> {appliedFilters.cities.join(', ')}
    
                    </li>
                  )}
                  {appliedFilters.years.length > 0 && (
                    <li className={componentStyles.filterTag} onClick={() => handleFilter(2,showYears)}>
                      <strong>Год:</strong> {appliedFilters.years.join(', ')}
    
                    </li>
                  )}
                  {appliedFilters.sections.length > 0 && (
                    <li className={componentStyles.filterTag} onClick={() => handleFilter(3,showSections)}>
                      <strong>Раздел:</strong> {appliedFilters.sections.join(', ')}
    
                    </li>
                  )}
                  {appliedFilters.rows.length > 0 && (
                    <li className={componentStyles.filterTag} onClick={() => handleFilter(4,showRows)}>
                      <strong>Строка:</strong> {appliedFilters.rows.join(', ')}
    
                    </li>
                  )}
                  {appliedFilters.columns.length > 0 && (
                    <li className={componentStyles.filterTag} onClick={() => handleFilter(5,showColumns)}>
                      <strong>Столбец:</strong> {appliedFilters.columns.join(', ')}
    
                    </li>
                  )}
                </ul>
              </div>
            )

}

export default AppliedFilters