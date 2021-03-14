import { useEffect, useState } from "react";
import Carousel from "../../components/Carousel";
import FeaturedSection from "../../components/FeaturedSection";

export default function Home() {
    const [storeData, setStoreData] = useState<any>();

    useEffect(() => {
        fetchData();
    }, [])

    async function fetchData() {
        const result = await fetch(`/products`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        const realresult = await result.json();
        setStoreData(realresult);

    }

    return (
        <div className="Home">
            <Carousel />
            {storeData ? <FeaturedSection data={storeData} title="Viewer's Favourites" /> : null}
        </div>
    )
}