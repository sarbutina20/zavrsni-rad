import { useEffect } from "react"
import { useDispatch } from "react-redux"
import {brisanjeStanja} from "../../store/cartReducer"

const UspjesnaTransakcija = ( ) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(brisanjeStanja())
    }, [dispatch])

    return <h1>Uspješna transakcija</h1>
}

export default UspjesnaTransakcija