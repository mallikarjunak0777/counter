import { Button, Col, Form, Row } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FeesMaintenanceContext } from "../context/Context";
import { fetchExistingPayeeDetails } from "../actions/ExistingPayeeDetailsActionCreator";
import { fetchContactServicerIdDetails } from "../actions/ContactServicerIdActionCreator";
import { fetchIsisRefValues } from "../actions/IsisRefValuesActionCreator";
import { fetchPayeeAddressDetails } from "../actions/PayeeAddressActionCreator";
import { fetchBankingIdDetails } from "../actions/BankingIdActionCreator";
import CustomAlert from "../../components/common/CustomAlert";
import DatePicker from "react-datepicker";
import { fetchArsNameDescrDetails } from "../actions/ArsNameDescrActionCreator";

type Props<T> = {
    payeeDetails: T[];
    rows: {
        header: string;
        accessorKey: keyof T;
        cell: (obj: {
            item: T;
            key: keyof T;
            meta: {
                onUpdate: (payeeDetails: { index: number; key: keyof T; value: any }) => void;
            };
            row: any;
        }) => React.ReactNode;
    }[];
    meta: {
        onUpdate: (payeeDetails: { index: number; key: keyof T; value: any }) => void;
    };
};


type Data = {
    paymentReceiverType: string | null;
    contactServicerId: string | null;
    sapAddressId: string | null;
    sapBankingDetailId: string | null;
    paymentMethod: string | null;
    paymentTypeCode: string | null;
    PaymentMemo: string | null;
    sharePercent: string | null;
    effectiveDate: string | null;
    accountingReasonName: string | null;
    payImmediateIndicator: string | null;
    termDate?: string | null;
    status?: string | null;
};

const useReactTable = <T,>(props: Props<T>) => {
    const { payeeDetails } = props;

    return {
        getRowData() { },
        getHeaderGroups() {
            return {
                headers: props.rows.map((column) => {
                    return {
                        id: column.accessorKey,
                        render() {
                            return column.header;
                        },
                    };
                }),
            };
        },
        getRowModel() {
            return {
                rows: props.rows.map((row) => {
                    return {
                        header: row.header,
                        getCells() {
                            return payeeDetails.map((item) => {
                                return {
                                    id: "",
                                    cell: (args: { rowIndex: number; colIndex: number }) =>
                                        row.cell({
                                            item,
                                            key: row.accessorKey,
                                            meta: props.meta,
                                            row: args,
                                        }),
                                };
                            });
                        },
                    };
                }),
            };
        },
    };
};

const PayeeDetails = (props: any) => {
    const dispatch = useDispatch();
    const { gaId, db, isEditBtnClicked, setEditBtnClicked} = useContext(FeesMaintenanceContext);
    const [payeeDetails, setPayeeDetails] = useState<any[]>([]);
    const [csvIdDetails, setCsvIdDetails] = useState<any[]>([]);
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [payeeAddress,setPayeeAddress]=useState<any[]>([]);
    const [currentIndex,setCurrentIndex]=useState<number>(0);

    setEditBtnClicked(true);
    const existingPayeeDetailsReducer = useSelector(
        (state: any) => state.existingPayeeDetailsReducer
    );

    const contactServicerIdDetailsReducer = useSelector(
        (state: any) => state.contactServicerIdDetailsReducer
    );

    const payeeAddressDetailsReducer = useSelector(
        (state: any) => state.payeeAddressDetailsReducer
    );

    const bankingIdDetailsReducer = useSelector(
        (state: any) => state.bankingIdDetailsReducer
    );

    const isisRefValuesReducer = useSelector(
        (state: any) => state.isisRefValuesReducer
    );    

    const arsNameDescrDetailsReducer = useSelector(
        (state: any) => state.arsNameDescrDetailsReducer
    );    

    console.log("==>arsNameDescrDetailsReducer",arsNameDescrDetailsReducer);

    useEffect(()=>{
        setPayeeAddress([...payeeAddress,...payeeAddressDetailsReducer.data]);
    },[payeeAddressDetailsReducer]);

    console.log("==>payeeAddressDetailsReducer",payeeAddressDetailsReducer);

    useEffect(() => {
        dispatch(fetchExistingPayeeDetails(localStorage.getItem("sessionId") || "", db, gaId, props.data.data[0]?.feeRuleId));
        dispatch(fetchContactServicerIdDetails(localStorage.getItem("sessionId") || "", db, gaId, false, false));
        dispatch(fetchIsisRefValues(localStorage.getItem("sessionId") || "", db, "paymentArsName", "SUPP_BP_PAY_INFO", "ARS_NAME", false, false));
        dispatch(fetchIsisRefValues(localStorage.getItem("sessionId") || "", db, "paymentMethod", "SUPP_BP_PAY_INFO", "PAYMENT_METHOD", false, false));
        dispatch(fetchIsisRefValues(localStorage.getItem("sessionId") || "", db, "paymentType", "SUPP_BP_PAY_INFO", "PAYMENT_TYPE", false, false));
        dispatch(fetchIsisRefValues(localStorage.getItem("sessionId") || "", db, "paymentReceiverType", "SUPP_BP_PAY_INFO", "PAYMENT_RECEIVER_TYPE", false, false));       
        dispatch(fetchArsNameDescrDetails(localStorage.getItem("sessionId") || "", db,false, false));
        // dispatch(fetchBankingIdDetails(localStorage.getItem("sessionId") || "", db, "719792", false, false));
    }, [props.data.data[0]?.feeRuleId]);

 
    useEffect(() => {
        if (existingPayeeDetailsReducer) {
            const setStatus = existingPayeeDetailsReducer.activePayeeDetails.map((item: any) => ({ ...item, status: "active" }))
            setPayeeDetails(setStatus);
        }
    }, [existingPayeeDetailsReducer]);

    useEffect(() => {
        const active = payeeDetails.filter((item: any) => !item.termDate);
        const complete = [...payeeDetails, ...existingPayeeDetailsReducer.termedPayeeDetails];
        isChecked ? setPayeeDetails(complete) : setPayeeDetails(active)
    }, [isChecked]);



    useEffect(() => {
        let result = contactServicerIdDetailsReducer?.data?.filter((csvData: any) =>
            payeeDetails.some((payeeData: any) => payeeData?.contactServicerId == csvData?.csvId));
    
       let updatedCsvIdDetails= result.map((item:any)=>{
        const updateResult={...item};

            payeeDetails.forEach((payee:any)=>{
                arsNameDescrDetailsReducer.data.forEach((arsName:any)=>{
                    if(arsName.name ===payee.accountingReasonName){
                        updateResult.arsNamedescr=arsName.descr;
                 }
                })
            })       
            return  updateResult;
        });
        setCsvIdDetails(updatedCsvIdDetails);
      dispatch(setPayeeDetails(payeeDetails));
      
    }, [payeeDetails]);

    useEffect(()=>{
        console.log("==>csvIdDetails",csvIdDetails);
        csvIdDetails.map((item:any,index:any)=>{
            if(index === currentIndex){
            dispatch(fetchPayeeAddressDetails(localStorage.getItem("sessionId") || "", "isis", item.csvId, false, false));
            dispatch(fetchBankingIdDetails(localStorage.getItem("sessionId") || "", "isis", item.csvId, false, false));
            }
        });

    },[csvIdDetails]);
    useEffect(()=>{
        console.log("==>inside loop");
                setPayeeAddress([...payeeAddress,...payeeAddressDetailsReducer.data]);
    },[payeeAddressDetailsReducer]);




        console.log("==p>",payeeAddress);

    const table = useReactTable<Data>({
        payeeDetails,
        // map the keys array here to return this object instead of hardcoding
        rows: [
            {
                header: "Payment Receiver Type",
                accessorKey: "paymentReceiverType",
                cell: ({ item: obj, key, row, meta }) => {
                    // this should be called for cell
                    if ((obj.status === "new") && isEditBtnClicked) {
                        return (
                            <Form.Control
                                as="select"
                                custom
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setCurrentIndex(row.colIndex);
                                    meta.onUpdate({
                                        index: row.colIndex,
                                        value,
                                        key,
                                    });
                                }}
                                name={key}
                                value={obj[key]!}>

                                {obj.status === "new" ? <option value="">Choose Payment Receiver Type</option> : ""}
                                {isisRefValuesReducer?.paymentReceiverTypeList.map((option: any) => {
                                    return <option key={option}>{option}</option>
                                })
                                }
                            </Form.Control>

                        );
                    }

                    return obj[key];
                },
            },
            {
                header: "Contact Servicer ID",
                accessorKey: "contactServicerId",
                cell: ({ item: obj, key, row, meta }) => {
                    if ((obj.status === "new") && isEditBtnClicked) {
                        return (
                            <Form.Control
                                as="select"
                                custom
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setCurrentIndex(row.colIndex);
                                    meta.onUpdate({
                                        index: row.colIndex,
                                        value,
                                        key,
                                    });                                  
                                }}
                                name={key}
                                value={obj[key]!}>
                                {obj.status === "new" ? <option value="">Choose Contact Servicer ID</option> : ""}
                                {contactServicerIdDetailsReducer?.csvIdDetails.map((option: any) => {
                                    return <option key={option}>{option}</option>
                                })
                                }
                            </Form.Control>
                        );
                    }

                    return obj[key];
                },
            },
            {
                header: "Payee Address",
                accessorKey: "sapAddressId",
                cell: ({ item: obj, key, row, meta }) => {
                    // this should be called for cell
                    if ((obj.status === "active" || obj.status === "new") && isEditBtnClicked) {
                        const filterData =payeeAddress.filter((option: any) => option.csvIId == obj["contactServicerId"]);                   
                        return (
                            <Form.Control
                                as="select"
                                custom
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setCurrentIndex(row.colIndex);
                                    meta.onUpdate({
                                        index: row.colIndex,
                                        value,
                                        key,
                                    });
                                }}
                                name={key}
                                value={obj[key]!}>
                                {obj.status === "new" ? <option value="">Choose Payee Address</option> : ""}
                                { filterData?.map((option: any) => {
                                   
                                return <option key={option.sapAddressId}>{option.sapAddressId}</option>
                                    
                                })
                                }
                            </Form.Control>
                        );
                    }

                    return obj[key];
                },
            },
            {
                header: "Banking ID",
                accessorKey: "sapBankingDetailId",
                cell: ({ item: obj, key, row, meta }) => {
                    if ((obj.status === "active" || obj.status === "new") && isEditBtnClicked) {
                        return (
                            <Form.Control
                                as="select"
                                custom
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setCurrentIndex(row.colIndex);
                                    meta.onUpdate({
                                        index: row.colIndex,
                                        value,
                                        key,
                                    });
                                }}
                                name={key}
                                value={obj[key]!}>
                                {obj.status === "new" ? <option value="">Choose Banking ID</option> : ""}
                                {obj.status === "active" && bankingIdDetailsReducer?.sapBankingDetailIds.map((option: any) => {
                                    return <option key={option}>{option}</option>
                                })
                                }
                            </Form.Control>
                        );
                    }
                    return obj[key];
                },
            },
            {
                header: "Payment Method",
                accessorKey: "paymentMethod",
                cell: ({ item: obj, key, row, meta }) => {
                    // this should be called for cell
                    if ((obj.status === "active" || obj.status === "new") && isEditBtnClicked) {
                        return (
                            <Form.Control
                                as="select"
                                custom
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setCurrentIndex(row.colIndex);
                                    meta.onUpdate({
                                        index: row.colIndex,
                                        value,
                                        key,
                                    });
                                }}
                                name={key}
                                value={obj[key]!}>
                                {obj.status === "new" ? <option value="">Choose Payment Method</option> : ""}
                                {isisRefValuesReducer?.paymentMethodList.map((option: any) => {
                                    return <option key={option}>{option}</option>
                                })
                                }
                            </Form.Control>
                        );
                    }

                    return obj[key];
                },
            },
            {
                header: "Payment Type",
                accessorKey: "paymentTypeCode",
                cell: ({ item: obj, key, row, meta }) => {
                    // this should be called for cell
                    if ((obj.status === "active" || obj.status === "new") && isEditBtnClicked) {
                        return (
                            <Form.Control
                                as="select"
                                custom
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setCurrentIndex(row.colIndex);
                                    meta.onUpdate({
                                        index: row.colIndex,
                                        value,
                                        key,
                                    });
                                }}
                                name={key}
                                value={obj[key]!}>
                                {obj.status === "new" ? <option value="">Choose Payment Type</option> : ""}
                                {isisRefValuesReducer?.paymentTypeList.map((option: any) => {
                                    return <option key={option}>{option}</option>
                                })
                                }
                            </Form.Control>
                        );
                    }

                    return obj[key];
                },
            },
            {
                header: "Payment Memo",
                accessorKey: "PaymentMemo",
                cell: ({ item: obj, key }) => {
                    // this should be called for cell
                    if ((obj.status === "active" || obj.status === "new") && isEditBtnClicked) {
                        return (
                            <p></p>
                        );
                    }

                    return obj[key];
                },
            },
            {
                header: "Percent to Payee",
                accessorKey: "sharePercent",
                cell: ({ item: obj, key,row,meta }) => {
                    // this should be called for cell
                    if ((obj.status === "active" || obj.status === "new") && isEditBtnClicked) {
                        return (
                            <Form.Control  onChange={(e) => {
                                const value = e.target.value;
                                setCurrentIndex(row.colIndex);
                                meta.onUpdate({
                                    index: row.colIndex,
                                    value,
                                    key,
                                });
                            }} as="input" 
                            name="key" maxLength={3} value={obj[key]!} />
                        );
                    }
                    return obj[key];
                },
            },
            {
                header: "Effective Date",
                accessorKey: "effectiveDate",
                cell: ({ item: obj, key, row, meta }) => {
                    // this should be called for cell
                    if ((obj.status === "active" || obj.status === "new") && isEditBtnClicked) {
                        return (
                            <DatePicker
                                dateFormat="dd-MMM-yyyy"
                                onChange={(inDate) => {
                                    const value = inDate;
                                    setCurrentIndex(row.colIndex);
                                    meta.onUpdate({
                                        index: row.colIndex,
                                        value,
                                        key,
                                    });
                                }}
                                className="form-control my-1 mr-sm-2"
                                placeholderText="dd-MMM-yyyy"

                                selected={obj[key]! ? new Date(obj[key]!) : new Date()}
                                minDate={new Date(obj[key]!)}
                            />
                        );
                    }

                    return obj[key];
                },
            },
            {
                header: "Termination Date",
                accessorKey: "termDate",
                cell: ({ item: obj, key, row, meta }) => {
                    // this should be called for cell
                    if ((obj.status === "active" || obj.status === "new") && isEditBtnClicked) {
                        return (
                            <DatePicker
                                dateFormat="DD-MON-yyyy"
                                onChange={(inDate) => {
                                    const value = inDate;
                                    setCurrentIndex(row.colIndex);
                                    meta.onUpdate({
                                        index: row.colIndex,
                                        value,
                                        key,
                                    });
                                }}
                                className="form-control my-1 mr-sm-2"
                                placeholderText="DD-MON-YYYY"
                                selected={obj[key]! ? new Date(obj[key]!) : null}
                                minDate={new Date()}
                            />
                        );
                    }

                    return obj[key];
                },
            },
            {
                header: "Payment ARS Name",
                accessorKey: "accountingReasonName",
                cell: ({ item: obj, key, row, meta }) => {
                    // this should be called for cell
                    if ((obj.status === "active" || obj.status === "new") && isEditBtnClicked) {
                         const filterData =isisRefValuesReducer?.paymentArsName.filter((option: any) => (option.highValue ===  obj["paymentReceiverType"] ));
                        return (
                            <Form.Control
                                as="select"
                                custom
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setCurrentIndex(row.colIndex);
                                    meta.onUpdate({
                                        index: row.colIndex,
                                        value,
                                        key,
                                    });
                                }}
                                name={key}
                                value={obj[key]!}>
                                {obj.status === "new" ? <option value="">Choose Payment ARS Name</option> : ""}
                                { filterData.map((option: any) => {
                                    return <option key={option}>{option.lowValue}</option>
                                })
                                } 
                                {/* {isisRefValuesReducer?.paymentArsNameList.map((option: any) => {
                                    return <option key={option}>{option}</option>
                                })
                                } */}
                            </Form.Control>
                        );
                    }

                    return obj[key];
                },
            },
            {
                header: "Pay Immediate",
                accessorKey: "payImmediateIndicator",
                cell: ({ item: obj, key, row, meta }) => {
                    // this should be called for cell
                    if ((obj.status === "active" || obj.status === "new") && isEditBtnClicked) {
                        return (
                            <Form.Control
                                as="select"
                                custom
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setCurrentIndex(row.colIndex);
                                    meta.onUpdate({
                                        index: row.colIndex,
                                        value,
                                        key,
                                    });
                                }}
                                name={key}
                                value={obj[key]!}>
                                {obj.status === "new" ? <option value="">Choose Pay Immediate</option> : ""}
                                <option value="Y">Yes</option>
                                <option value="N">No</option>
                            </Form.Control>
                        );
                    }

                    return obj[key];
                },
            },
        ],
        meta: {
            onUpdate: (payload) => {
                console.log(payload);
                setPayeeDetails((prevData) => {
                    return prevData.map((d, i) => {
                        if (i === payload.index) {
                            return {
                                ...d,
                                [payload.key]: payload.value,
                            };
                        }

                        return d;
                    });
                });
            },
        },
    });
    console.log(payeeDetails);

    const handleAddPayeeBtn: any = () => {

        setPayeeDetails([{
            paymentReceiverType: "",
            contactServicerId: "",
            sapAddressId: "",
            sapBankingDetailId: "",
            paymentMethod: "",
            paymentTypeCode: "",
            PaymentMemo: "",
            sharePercent: "",
            effectiveDate: "",
            accountingReasonName: "",
            payImmediateIndicator: "",
            status: "new"
        }, ...payeeDetails])

    }

    const toggleCheckboxChange: any = () => {
        setIsChecked(!isChecked)
    }

    return (
        <>
            <div>
                <Row>
                    <Col>
                        <div className="card">
                            <div className="card-header plansetp-subheading-fontsize plansetp-subheading-bgcolor">
                                <Row className="margin-padding-zero  plansetp-padding-top">
                                    <span >Payee Details</span>
                                </Row>

                            </div>
                        </div>
                        {payeeDetails?.length !== 0 && (
                            <div key={`inline-checkbox`} className="formRadios">
                                <Form.Check
                                    inline
                                    label={"Show Terminated"}
                                    type={"checkbox"}
                                    id={"inline-checkbox-1"}
                                    checked={isChecked}
                                    onChange={toggleCheckboxChange}
                                    disabled={existingPayeeDetailsReducer?.termedPayeeDetails.length > 0 ? false : true}
                                />
                            </div>)}
                        <div className="table-container">
                            {payeeDetails?.length === 0 ? (<CustomAlert
                                propsClass="rev-share-alert"
                                variant="warning"
                                heading={
                                    <div style={{ marginTop: '-4px', marginLeft: '8px' }}>
                                        <span
                                            style={{
                                                color: "orange",
                                                textShadow: "0 0 0 green",
                                                fontSize: "2em"
                                            }}
                                        >
                                            &#9888;
                                        </span>{"  "}
                                        <span>{payeeDetails?.length === 0 ? "No Payees Details"
                                            : existingPayeeDetailsReducer?.activePayeeDetails.length === 0 ? "No Active Payees Details" : ""}</span>
                                    </div>
                                }
                                showCloseIcon={false}
                            />) : (
                                <table >
                                    <tbody>
                                        {table.getRowModel().rows.map((row, index) => {
                                            return (
                                                <tr key={index}>
                                                    <th>{row.header}</th>
                                                    {row.getCells().map((cell, cindex) => {
                                                        return (
                                                            <td key={cindex}>
                                                                {cell.cell({
                                                                    colIndex: cindex,
                                                                    rowIndex: index,
                                                                })}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>)}
                        </div></Col>
                    <Col>
                        <div className="card">
                            <div className="card-header plansetp-subheading-fontsize plansetp-subheading-bgcolor">
                                <Row className="margin-padding-zero  plansetp-padding-top">
                                    <span>Contact Servicer ID Payment Details</span>
                                </Row>
                            </div>
                        </div>
                        <div className="table-container-csvIdDetails">
                        {csvIdDetails?.length === 0 ? (<CustomAlert
                                propsClass="rev-share-alert"
                                variant="warning"
                                heading={
                                    <div style={{ marginTop: '-4px', marginLeft: '8px' }}>
                                        <span
                                            style={{
                                                color: "orange",
                                                textShadow: "0 0 0 green",
                                                fontSize: "2em"
                                            }}
                                        >
                                            &#9888;
                                        </span>{"  "}
                                        <span>{csvIdDetails?.length === 0 && "No Contact Servicer ID Payment Details"}</span>
                                    </div>
                                }
                                showCloseIcon={false}
                            />) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Contact Servicer ID</th>
                                        <th>ARS Description</th>
                                        <th>Payee Frequency</th>
                                        <th>Payment Date</th>
                                        <th>Payee Status</th>
                                        <th>Payment Limit Amount</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {csvIdDetails?.map((csvIds: any, index: any) => {
                                        return (
                                            <tr>
                                                <td>{csvIds.csvId}</td>
                                                <td>{csvIds.arsNamedescr}</td>
                                                <td> {csvIds.paymentFrequency}</td>
                                                <td>{csvIds.payeeStatusEffdae}</td>
                                                <td>{csvIds.payeeStatus}</td>
                                                <td> {csvIds.paymentLimitAmount} </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>)}
                        </div>
                        <br />
                    </Col>
                </Row>

            </div><br />
            <div className="text-center col-6 mx-auto btn-lg"><Button
                onClick={handleAddPayeeBtn}>Add Additional Payee</Button> </div>
        </>


    );
};

export default PayeeDetails;
