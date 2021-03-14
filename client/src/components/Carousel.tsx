import "./Carousel.css";

export const Carousel = () => {
    return (
        <section className="carousel" aria-label="Gallery">
            <ol className="carousel__viewport">
                <li id="carousel__slide1"
                    tabIndex={0}
                    className="carousel__slide">
                    <div className="image-container">
                        <img src="https://cdn.shopify.com/s/files/1/0058/4538/5314/files/TECH_SCARVES__LTTSTORE_BANNERS_Desktop_2200x.png?v=1612571786" alt="carousel-1-pic" />
                    </div>
                    <div className="carousel__snapper">
                    </div>
                </li>
                <li id="carousel__slide2"
                    tabIndex={0}
                    className="carousel__slide">
                    <div className="image-container">
                        <img src="https://cdn.shopify.com/s/files/1/0058/4538/5314/files/LTT_Underwear_V2_Banners-Desktop_2200x.png?v=1612571743" alt="carousel-2-pic" />
                    </div>
                    <div className="carousel__snapper"></div>
                </li>
                <li id="carousel__slide3"
                    tabIndex={0}
                    className="carousel__slide">
                    <div className="image-container">
                        <img src="https://cdn.shopify.com/s/files/1/0058/4538/5314/files/CPU_Pillow_Banners_LTTStore-01_2200x.png?v=1611360151" alt="carousel-3-pic" />
                    </div>
                    <div className="carousel__snapper"></div>
                </li>
            </ol>
            <aside className="carousel__navigation">
                <ol className="carousel__navigation-list">
                    <li className="carousel__navigation-item">
                        <a href="#carousel__slide1"
                            className="carousel__navigation-button">Go to slide 1</a>
                    </li>
                    <li className="carousel__navigation-item">
                        <a href="#carousel__slide2"
                            className="carousel__navigation-button">Go to slide 2</a>
                    </li>
                    <li className="carousel__navigation-item">
                        <a href="#carousel__slide3"
                            className="carousel__navigation-button">Go to slide 3</a>
                    </li>
                </ol>
            </aside>
        </section>
    )
}

export default Carousel;