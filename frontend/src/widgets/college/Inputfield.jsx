import '../../components/College/CollegeInfo.css';
const Inputfield=({eltname,type,label,id,htmlfor,classname,radiolabel,options=[],error,onchange,disabled,value})=>{
    if(type==="radio"){
        return(
            <div className={classname}>
            <div className="radio-group">
            <label>{radiolabel}</label>
                {options.map((option)=>(
                    <label id="collegelabel2">
                        <input key={option.value} type={type} name={eltname} value={option.value} onChange={onchange} disabled={disabled}/>{option.label}
                    </label>
                ))}
                </div>
                {error && <span className='error-message'>{error}</span>}
        </div>
        )
    }
    else{
        return( 
        <div className={classname}>
        
        <div className="collegeinput">
            <label id="collegelabel" htmlFor={htmlfor}>{label} </label>
            <input type={type} id={id} name={eltname} onChange={onchange} disabled={disabled} value={value}/>
        </div>
        {error && <span className='error-message'>{error}</span>}
        </div>
    )
    }

}

export default Inputfield