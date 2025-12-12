import { useState, useEffect,useRef } from 'react';
import axios from 'axios';

export const useTableData = (api, limit) => {
    const [strings, setStrings] = useState([])
    const [thead, setThead] = useState([]);
    const [loadingMoreData, setLoadingMoreData] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [forms,setForms]=useState([])
    const [currentForm,setCurrentForm]=useState(null)

    const offset=useRef(0);
    const maxSize=useRef(0)

    const getMaxSize = () => maxSize.current;

    const [dfilter, setDfilter] = useState({
    "filters": [],
    "limit": limit,
    "offset": 0
  })

    useEffect(() => {
    axios.post(`${api}/api/v2/filtered-data`, dfilter).then((response) => {
      const newData = response.data.data || [];
      setStrings(prev => offset.current === 0 ? newData : [...prev, ...newData])
      setForms(["1-ФК", "3-ФК"])
      setCurrentForm(forms[0])
      setThead(response.data.headers || []);
      if (newData.length < limit || offset.current + limit >= response.data.max_size) {
        setHasMore(false);
      }
      setLoadingMoreData(false)
      maxSize.current=response.data.max_size
    }).catch((error) => {
      console.error("Ошибка при получении данных:", error);
    });
  }, [dfilter]);

  const loadMore = () => {
    setLoadingMoreData(true)
    offset.current=offset.current + limit
    setDfilter({
      ...dfilter,
      offset: offset.current
    })
  }
  return {strings,thead,loadMore,hasMore,loadingMoreData,getMaxSize,setDfilter,setStrings,offset,dfilter,forms,currentForm,setCurrentForm}
}