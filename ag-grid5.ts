import { Button, Col, Form, Row } from "react-bootstrap";
import React, { useContext, useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FeesMaintenanceContext } from "../context/Context";
import AgGridComponent from "../../components/common/AgGridComponent";
import { GridApi } from "ag-grid-community";
import DatePicker from "react-datepicker";
import moment from "moment";
import { setRateChangeData } from "../actions/RateActionCreator";
import { compareArraysOfObjects, validatePattern } from "../../utils/CommonUtils";


type RateDetail = {
    annualRate: string;
    lowThreshValue: string;
    highThreshValue: string;
    effdate: Date;
};

type Props = {
    rateType: string;
    activeRateDeatils: RateDetail[];

};
const BreakpointTiredRate = (props: Props) => {
    
    const { gaId, db, userId, isUserHasAccessToPlan, isChangeRateBtn, setIsChangeRateBtn } = useContext(FeesMaintenanceContext);
    const [data, setData] = useState<any>([]);
    const [isAddRowBtnDisabled, setIsAddRowBtnDisabled] = useState<boolean>(false);
    const [isClearRatesBtnDisabled, setIsClearRatesBtnDisabled] = useState<boolean>(false);
    const [isClearThresholdBtnDisabled, setIsClearThresholdBtnDisabled] = useState<boolean>(false);
    const [isClearAllBtnDisabled, setIsClearAllBtnDisabled] = useState<boolean>(false);
    const [isSaveBtnDisabled, setIsSaveBtnDisabled] = useState<boolean>(false);
    const [termDate, setTermDate] = useState<Date>();
    
    const dispatch = useDispatch();

    const feeRuleSetUpInfoReducer = useSelector(
        (state: any) => state.feeRuleSetUpInfoReducer?.feeRuleSetUpData
    );
    const ratesReducer = useSelector(
        (state: any) => state.ratesReducer
    );
   
    useMemo(() => {
        const dataArr = ratesReducer?.updatedActiveRates?.map((rate:any) => ({
            annualRate: rate.annualRate ? rate.annualRate?.replace(/[$,%]/g, "") : "",
            lowThreshValue: rate.lowThreshValue ? (rate?.lowThreshValue?.replace(/[$,]/g, "")) : "",
            highThreshValue: rate?.highThreshValue ? (rate?.highThreshValue?.replace(/[$,]/g, "")) : ""
        }));
       setTermDate(ratesReducer.termDate ? new Date(ratesReducer?.termDate) : undefined);
        setData(dataArr);
      
    }, [ratesReducer]);

    const handleInputChange = (e: any, index: any, columnName: any) => {
        const { value } = e.target;
    
        setData((prevData: any) =>
            prevData.map((row: any, i: any) => {
                if (i === index) {
                    return { ...row, [columnName]: value };
                }
                else if (i === index + 1 && columnName === "highThreshValue" ) {
                    const lowThreshValue = parseFloat(value) + 0.01;
                    return { ...row, lowThreshValue: value ? lowThreshValue.toString() : "" }
                }
                return row;
            })
        );
        
        // if (columnName === 'annualRate') {
        //     const updatedErrors:any = [...annualRateErrors];
        //     updatedErrors[index] = !validateAnnualRate(value);
        //     setAnnualRateErrors(updatedErrors);
        //   }
      
        //   if (columnName === 'highThreshValue') {
        //     const updatedErrors:any = [...highThreshValueErrors];
        //     updatedErrors[index] = !validateHighThreshValue(value, index);
        //     setHighThreshValueErrors(updatedErrors);
        //   }
    };

   
      
    const validateAnnualRate = (annualRate: any) => {

        return validatePattern(annualRate);
    };

    const validateHighThreshValue = (highThreshValue: any, currentIndex: any) => {

        if (!highThreshValue) {
            if (currentIndex === data.length - 1) {
                return true; // Exclude the last object
            }
        } else {
            if (highThreshValue === '') {
                return false;
            }
        }
        const currentHighThreshValue = parseFloat(data[currentIndex]?.highThreshValue);
        const currentLowThreshValue = parseFloat(data[currentIndex]?.lowThreshValue);
        let validateValue = currentHighThreshValue === undefined || (currentHighThreshValue && currentHighThreshValue > currentLowThreshValue);
          !validateValue?  setIsSaveBtnDisabled(true) :   setIsSaveBtnDisabled(false);
        return validateValue;
    };

    // const hasError = (value: any, columnName: any, currentIndex: any) => {

    //     switch (columnName) {
    //         case 'annualRate':
    //             return !validateAnnualRate(value);
    //         case 'highThreshValue':
    //             return !validateHighThreshValue(value, currentIndex);
    //         default:
    //             return false;
    //     }
    // };

    const newRow: any = {
        annualRate: "",
        lowThreshValue: 0.01,
        highThreshValue: ""
    }

    const buttonsDetails = [
        {
            btnLabel: 'Cancel',
            onBtnClick: (e: any) => handleCancelBtn(e),
            disabled: false,// isAddRowBtnDisabled
        },
        {
            btnLabel: 'Add Row',
            onBtnClick: (e: any) => handleAddRow(e),
            disabled: isAddRowBtnDisabled
        },
        {
            btnLabel: 'Clear Rates',
            onBtnClick: (e: any) => handleClearRatesBtn(e),
            disabled: isClearRatesBtnDisabled
        },
        {
            btnLabel: 'Clear Threshold',
            onBtnClick: (e: any) => handleClearThresholdBtn(e),
            disabled: isClearThresholdBtnDisabled
        },
        {
            btnLabel: 'Clear All',
            onBtnClick: (e: any) => handleClearAllBtn(e),
            disabled: isClearAllBtnDisabled,
        },
        {
            btnLabel: 'Save',
            onBtnClick: (e: any) => handleSaveBtn(e),
            disabled: isSaveBtnDisabled
        },

    ];

    const handleAddRow = (event: any) => {
        const lastRow = data[data.length - 1];
        const updatedNewRow = { ...newRow, lowThreshValue: lastRow?.highThreshValue ? parseFloat(lastRow?.highThreshValue) + 0.01 : null }
        setData((prevData: any) => [...prevData, updatedNewRow])
    };

    const handleClearRatesBtn = (event: any) => {
        setData((prevData: any) => {
            let modifiedData = [...prevData];
            modifiedData = modifiedData.map((row: any, index: any) => {
                const { lowThreshValue, highThreshValue } = row;
                return { annualRate: "", lowThreshValue: lowThreshValue, highThreshValue: highThreshValue }

            })
            modifiedData = modifiedData.filter(
                (row: any) => Object.values(row).some((value) => value !== "")
            );
            return modifiedData;
        })
    };


    const handleClearThresholdBtn = (event: any) => {
        setData((prevData: any) => {
            let modifiedData = [...prevData];
            if (modifiedData.length >= 1) {
                modifiedData = modifiedData.map((row: any, index: any) => {
                    if (index === 0) {
                        const { annualRate, lowThreshValue } = row;
                        return { annualRate: annualRate, lowThreshValue: lowThreshValue, highThreshValue: "" }
                    }
                    else {
                        const { annualRate } = row;
                        return { annualRate: annualRate, lowThreshValue: "", highThreshValue: "" }
                    }
                })
            }
            modifiedData = modifiedData.filter(
                (row: any) => Object.values(row).some((value) => value !== "")
            );
            return modifiedData;
        });

    };

    const handleClearAllBtn = (event: any) => {
        setData((prevData: any) => {
            let modifiedData = [...prevData];
            if (modifiedData.length >= 1) {
                modifiedData = modifiedData.map((row: any, index: any) => {
                    if (index === 0) {
                        const { annualRate, ...rest } = row;

                        return { ...rest, highThreshValue: "", annualRate: "" }
                    }
                    else {
                        const { annualRate, ...rest } = row;
                        return { ...rest, highThreshValue: "", lowThreshValue: "" }
                    }
                })
            }
            modifiedData = modifiedData.filter(
                (row: any) => Object.values(row).some((value) => value !== "")
            )
            return modifiedData;
        });

    };


    const handleSaveBtn = (event: any) => {
        const formatter = new Intl.NumberFormat('en-US',
            {
                style: 'currency',
                currency: 'USD',
            });

        const viewData: any = [];
        const saveData: any = [];
        const chargeTypeForSave = feeRuleSetUpInfoReducer[0]?.chargeType === "PCT" ? "value" : "amount"
        data.map((row: any) => {
            const newRowForSave = {
                ...row,
                [chargeTypeForSave]: row.annualRate,
                termDate: "",
                highThreshValue: row.highThreshValue,
                lowThreshValue: row.lowThreshValue,
                effDate: moment(termDate).add(1, 'days').format("DD MMM YYYY")

            }
            delete newRowForSave.annualRate;
            saveData.push(newRowForSave);

            const newRowForView = {
                ...row,
                annualRate: feeRuleSetUpInfoReducer[0]?.chargeType === "PCT" ? row.annualRate + '%' : formatter.format(row.annualRate),
                termDate: "",
                highThreshValue: row.highThreshValue? formatter.format(row.highThreshValue) :"",
                lowThreshValue: formatter.format(row.lowThreshValue),
                effdate: moment(termDate).add(1, 'days').format("DD MMM YYYY")
            }
            viewData.push(newRowForView);

        });

        dispatch(setRateChangeData(moment(termDate).format('DD MMM YYYY'),
            moment(props.activeRateDeatils[0].effdate).format('DD MMM YYYY'),
            viewData, saveData
        ));
        setIsChangeRateBtn(false);
    };

    const handleCancelBtn = (event: any) => {
        setIsChangeRateBtn(false);
    };

    useEffect(() => {
        if (data.length === 1) {
            const clearRateAndThresholdDisable = data.some((obj: any) =>
                obj.annualRate === "" && obj.highThreshValue === "");

            setIsClearRatesBtnDisabled(clearRateAndThresholdDisable);
            setIsClearThresholdBtnDisabled(clearRateAndThresholdDisable);
            setIsClearAllBtnDisabled(clearRateAndThresholdDisable);
            setIsSaveBtnDisabled(clearRateAndThresholdDisable);
        }
        const clearRatedDisable = data.every((obj: any) =>
            obj.annualRate === "");
        setIsClearRatesBtnDisabled(clearRatedDisable);
        setIsSaveBtnDisabled(clearRatedDisable);

        const clearThresholdDisable = data.every((obj: any) =>
            obj.lowThreshValue === "" || obj.highThreshValue === "");
        setIsClearThresholdBtnDisabled(clearThresholdDisable);

        const dataNullValues = data.some((obj: any) =>
            Object.values(obj).some(value => value === "")
        );
        setIsAddRowBtnDisabled(dataNullValues);
        setIsSaveBtnDisabled(dataNullValues)

        const dataArr = ratesReducer?.updatedActiveRates?.map((rate:any) => ({
            annualRate: rate.annualRate ? rate.annualRate?.replace(/[$,%]/g, "") : "",
            lowThreshValue: rate.lowThreshValue ? (rate?.lowThreshValue?.replace(/[$,]/g, "")) : "",
            highThreshValue: rate?.highThreshValue ? (rate?.highThreshValue?.replace(/[$,]/g, "")) : ""
        }));

        // setIsSaveBtnDisabled(compareArraysOfObjects(data,dataArr));
    }, [data]);
 const handleTermData=(e:any)=>{
    setTermDate(e);
    // setIsSaveBtnDisabled(false);
 }

    return (<>
        <div className="card">
            <div className="card-header plansetp-subheading-fontsize plansetp-subheading-bgcolor">
                <span>{props.rateType} Fee</span>
            </div>
        </div>
        <Row className="margin-padding-zero plansetp-padding-top plansetp-padding-bottom">
            <Col xs="1"></Col>
            <Col className="margin-padding-zero">
                <Row className="margin-padding-zero">
                    <Col xs="2" className="margin-padding-zero"><strong>Termination Date</strong></Col>
                    <Col xs="4" className="margin-padding-zero">
                        <DatePicker
                            dateFormat="dd-MMM-yyyy"
                            selected={termDate}
                            onChange={(indate: Date) => handleTermData(indate)}
                            minDate={moment(props.activeRateDeatils[0].effdate).toDate()}
                            className="form-control"
                            placeholderText="Choose Date"
                        />
                    </Col>

                </Row>
            </Col>
        </Row>
        <Row className="margin-padding-zero plansetp-padding-top plansetp-padding-bottom">
            <Col xs="1"></Col>
            <Col className="margin-padding-zero">
                <Row className="margin-padding-zero">
                    <Col xs="2" className="margin-padding-zero"><strong>Rate Type</strong></Col>
                    <Col xs="4" className="margin-padding-zero">  {props.rateType}
                    </Col>
                </Row>
            </Col>
        </Row>
        <Row className="margin-padding-zero plansetp-padding-top plansetp-padding-bottom">
            <Col xs="1"></Col>
            <Col className="margin-padding-zero">
                <Row className="margin-padding-zero">
                    <Col xs="2" className="margin-padding-zero"><strong>Threshold Type</strong></Col>
                    <Col xs="4" className="margin-padding-zero">
                    </Col>
                </Row>
            </Col>
        </Row>
        <div>
            <table className="custom-table">
                <thead>
                    <tr>
                        <th>Annual BPS/$ Amount</th>
                        <th>Low Balance Threshold</th>
                        <th>High Balance Threshold</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item: any, index: any) => (
                        <TableRow
                            key={item.lowThreshValue}
                            data={item}
                            index={index}
                            handleInputChange={handleInputChange}
                            // hasError={hasError}
                           // highThreshValueErrors={highThreshValueErrors}
                            //annualRateErrors={annualRateErrors}
                            type={feeRuleSetUpInfoReducer[0]?.chargeType}
                            validateAnnualRate={validateAnnualRate}
                            validateHighThreshValue ={validateHighThreshValue}

                        />
                    ))}
                </tbody>
            </table>
            <br />
            <div className="margin-padding-zero breakpoint-tried-all-btn">
                {buttonsDetails.map(({ btnLabel, onBtnClick, disabled }) => {
                   let termDateCheck = termDate ? false: true
                    return (
                        <Button data-testid="btn-save"
                            onClick={(e: any) => onBtnClick(e)}
                            disabled={termDateCheck||disabled}
                            className="margin-padding-zero breakpoint-tried-btn">{btnLabel}</Button>

                    )
                })}
            </div>
        </div>
    </>
    );
};

const TableRow = ({ data, index, handleInputChange, type,validateAnnualRate, validateHighThreshValue}: any) => {
    const { annualRate, lowThreshValue, highThreshValue } = data;
    const [annualRateErrors, setAnnualRateErrors] = useState(!validateAnnualRate(annualRate,index));
    const [highThreshValueErrors, setHighThreshValueErrors] = useState(!validateHighThreshValue(highThreshValue,index));
    const handleAnnualrateChange =(e:any)=>
    {
        const {value}=e.target;
        const isValid = validateAnnualRate(value,index);
        setAnnualRateErrors(!isValid);
        handleInputChange(e,index,"annualRate")
    }
    const handleHighThreshValueChange =(e:any)=>
    {
        const {value}=e.target;
        const isValid = validateHighThreshValue(value,index);
        setHighThreshValueErrors(!isValid);
        handleInputChange(e,index,"highThreshValue")
    }
    return (
        <tr>

            <td>
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"> {type === "PCT" ? "%" : "$"}</span>
                    </div>
                    <Form.Control
                        type="text"
                        value={annualRate}
                        onChange={(e) => handleAnnualrateChange(e)}
                        className="tableCell"
                        maxLength={type === "PCT" ? 9 : 17}
                    />
                </div>
                <br />
                {/* {hasError(annualRate, 'annualRate', index) && (
                    <Form.Text>{(parseFloat(annualRate) > 100 && type === "PCT")?"Value should to be less then or equal to 100":"Invalid input,only double values allowed"}</Form.Text>
                )} */}
                  {annualRateErrors  && (<Form.Text>{(parseFloat(annualRate) > 100 && type === "PCT")?"Value should to be less then or equal to 100":"Invalid input,only double values allowed"}</Form.Text> )}
            </td>
            <td> $ {lowThreshValue}</td>
            <td>
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"> $</span>
                    </div>
                    <Form.Control
                        type="text"
                        value={highThreshValue}
                        onChange={(e:any) => handleHighThreshValueChange(e)}
                        className="tableCell"
                        maxLength={17}
                    />
                </div>
                <br />
                {/* {hasError(highThreshValue, 'highThreshValue', index) && (
                    <Form.Text>Low value must be less than high value</Form.Text>
                )} */}
                {highThreshValueErrors  && (
          <Form.Text>Low value must be less than high value</Form.Text>
        )}
            </td>
        </tr>
    );
};

export default BreakpointTiredRate;
