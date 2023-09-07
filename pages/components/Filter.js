import Selector from "./Selector";
import { useState } from "react";
import { Button, Input } from "antd";
import Lejant from "./Lejant";

const Filter = (props) => {
    const [typename, setTypename] = useState(null);
    const [valueOfType, setValueOfType] = useState(null);


    const handleSelectorChange = (value) => {
        setTypename(value)
    }

    const handleInputChange = (e) => {
        setValueOfType(e.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        props.handleSubmit(typename, valueOfType)
    }

    return (
        <div style={{ width: "50%", marginLeft: "20%", marginTop: "2%" }}>
            <Selector typename={typename} handleSelectorChange={handleSelectorChange} style={{ display: "inline-block", width: "30%" }} />
            <Input placeholder="Value" value={valueOfType} onChange={handleInputChange} style={{ display: "inline-block", width: "20%", marginLeft: "5%" }} />
            <Button onClick={handleSubmit} type="primary" style={{ display: "inline-block", width: "15%", marginLeft: "5%" }}>ARA</Button>
            <Button onClick={props.handleTemizleSubmit} type="primary" style={{ display: "inline-block", width: "15%", marginLeft: "5%" }}>TEMİZLE</Button>
            <Lejant />
        </div>
    )
}

export default Filter;