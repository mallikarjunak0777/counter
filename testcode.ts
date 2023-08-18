const filteredErrorData = validateMassImportReducer.filter(
    (item: any) =>
      item.indIdError !== "" || item.subsetError !== "" || item.ssnError !== ""
  );

  const filteredSuccessData = validateMassImportReducer.filter(
    (item: any) =>
      item.indIdError === "" && item.subsetError === "" && item.ssnError === ""
  );

  const importSummerySuccessCount = useMemo(() => {
    return filteredSuccessData.reduce(
      (res: any, item: any) => {
        const { updatedSubset } = item;
        res.data[updatedSubset] = (res.data[updatedSubset] || 0) + 1;
        res.total = (res.total || 0) + 1;
        return res;
      },
      { data: {}, total: 0 }
    );
  }, [filteredSuccessData]);

  const importSummeryErrorCount = useMemo(() => {
    return filteredErrorData.reduce(
      (res: any, item: any) => {
       if(item.indIdError) {
        res.total = (res.total) + 1;
       }if(item.subsetError) {
        res.total = (res.total) + 1;
       }
       if(item.ssnError) {
        res.total = (res.total) + 1;
       }
        return res;
      },
      { total: 0 }
    );
  }, [filteredErrorData]);
