import './Popstar.css';


function Popstar(props) {

    const style = { border: "5px solid #49fb35" }

    return (

        <div className='pop-square'>
            <img src={props.imageURL} alt="popstar" onClick={e => props.holdPop(props.id)} style={props.isHeld ? style : {}}></img>
        </div>

    )
}

export default Popstar;