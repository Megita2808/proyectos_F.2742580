import { useEffect } from "react";
export default function Metadata({ title }) {

    useEffect(() => {
        document.title = title || 'Modistería Doña Luz'
    },[title])
    return null
}