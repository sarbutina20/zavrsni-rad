import styles from "./knjiga.module.css"

const Knjiga = ({knjiga}) => {
    console.log(knjiga.naslov);
    return (
        <div className={styles.knjiga}>
            <h3>{knjiga.naslov}</h3>
            <img src={knjiga.slika} alt={knjiga.naslov}></img>
            <button>Dodaj u košaricu</button>
        </div>
    )
}

export default Knjiga;