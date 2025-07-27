import '../../components/college/CollegeInfo.css';
const Inputfield=({eltname,type,label,id,htmlfor,classname,radiolabel,options=[],error,onchange,disabled,value,placeholder})=>{
    if(type==="radio"){
        return(
            <div className={classname}>
            <div className="radio-group">
            <label>{radiolabel}</label>
                {options.map((option)=>(
                    <label id="collegelabel2">
                        <input key={option.value} type={type} name={eltname} value={option.value} onChange={onchange} disabled={disabled} checked={option.value}/>{option.value}
                    </label>
                ))}
                </div>
                {error && <span className='error-message'>{error}</span>}
        </div>
        )
    }
    else if(type==="text"||type==="date"){
        return( 
        <div className={classname}>
        
        <div className="collegeinput">
            <label id="collegelabel" htmlFor={htmlfor}>{label} </label>
            <input type={type} id={id} name={eltname} onChange={onchange} disabled={disabled} value={value} placeholder={placeholder}/>
        </div>
        {error && <span className='error-message'>{error}</span>}
        </div>
    )
    }
    else if(type==="dropdown"){
        return (
            <div className={classname}>
                <div className="studentdropdown">
                    <label id="collegelabel" htmlFor={htmlfor}>{label}</label>
                    <select id={id} name={eltname} onChange={onchange}>
                        <option value="">--- Select ---</option>
                        {options.map((option)=> (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                {error && <span className='error-message'>{error}</span>}
            </div>
        );
    }

}

export default Inputfield