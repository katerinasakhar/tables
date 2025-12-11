import style from './Table.module.css';
function DataTable({ strings, thead, hasMore, loadMore, loadingMoreData }){
    return(
    <>
    <div className={style.tableContainer}>
        <table className={style.modernTable}>
            <thead>
                <tr>
                    {thead.map((head) => (
                    <th key={head}>{head}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
            {strings.length > 0 ? (
                strings.map((string) => (
                <tr key={string.id}>
                    {string.map((cell, idx) => (
                    <td key={idx}>{cell}</td>
                    ))}
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan={thead.length} className={style.emptyData}>
                    Нет данных
                </td>
                </tr>
            )}
            </tbody>
        </table>
    </div>
    {hasMore && (
        <div className={style.centeredFooter}>
        <button
            className={style.showMoreButton}
            onClick={loadMore}
            disabled={loadingMoreData}
        >
            {loadingMoreData ? 'Загрузка...' : 'Показать ещё'}
        </button>
        </div>
    )}
    </>
    )
}
export default DataTable