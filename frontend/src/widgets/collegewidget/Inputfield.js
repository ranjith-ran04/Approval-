import '../../components/College/CollegeInfo.css';
const Inputfield=({eltname,type,label,id,htmlfor,classname,radiolabel,options=[],})=>{
    if(type==="radio"){
        return(
            <div className={classname}>
            <div className="radio-group">
            <label>{radiolabel}</label>
                {options.map((option,index)=>(
                    <label id="collegelabel2">
                        <input key={index} type={type} name={eltname} value={option.value} />{option.label}
                        
                    </label>
                ))}
                </div>
        </div>

        )
    }
    // else if(type==="text"){
    //     <div className={classname}>
    //     <div>
    //         <label htmlFor={htmlfor}>{label}</label>
    //         <input type={type} id={id} name={eltname} value={value} />
    //     </div>
    //     </div>
    // }
    return(   

        <div className={classname}>
        <div className="collegeinput">
            <label id="collegelabel" htmlFor={htmlfor}>{label}</label>
            <input type={type} id={id} name={eltname}  />
        </div>

        </div>

    )
}

export default Inputfield