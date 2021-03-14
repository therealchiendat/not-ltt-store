import { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import SecretPassword from '../../components/SecretPassword';
import { useAppContext } from "../../libs/contextLibs";
import './Item.css';

interface ParamTypes {
    id: string
}

export default function Item() {
    const { id } = useParams<ParamTypes>();
    const [itemData, setItemData] = useState<any>();
    const [variantID, setVariantID] = useState<string>();
    const [secretPWVisible, setSecretPWVisible] = useState<boolean>(false);
    const [isDiscountable, setIsDiscountable] = useState<boolean>(false);
    const [variantItem, setVariantItem] = useState<number>(0);

    useEffect(() => {
        fetchData();
    }, [])

    async function fetchData() {
        const result = await fetch(`/api/products\\${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        const parsedResult = await result.json();
        setItemData(parsedResult);
        if (parsedResult.tags === 'discountable') {
            setIsDiscountable(true);
        }
    }

    function formatPrice(variants: any, i: number) {
        const variant = variants[i];
        const prices = variant.price;
        const currency = 'CAD';
        return `$${prices.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${currency}`;
    }

    function handleVariantChange(value: ChangeEvent, i: number) {
        setVariantID(value.target.id);
        setSecretPWVisible(false);
        setVariantItem(i);
        document.getElementById('image-' + i)?.scrollIntoView();
        if (itemData.tags === 'discountable') {
            setIsDiscountable(true);
        }
    }

    function handleSecretPassword() {
        if (variantID === undefined) setSecretPWVisible(false);
        else setSecretPWVisible(!secretPWVisible);
    }

    return (
        <div className="Item">
            <div className="picture">
                {itemData?.images.map((image: any, id: number) =>
                    <img key={'image-' + id} id={'image-' + id} src={image.src} />
                )}
            </div>
            <div className="detail">
                <div className="header">
                    <h1>{itemData?.title}</h1>
                    <h2>{itemData ? formatPrice(itemData.variants, variantItem) : null}</h2>
                    <hr />
                </div>
                <div className="content">
                    <div className="variants">
                        Available Love Language:
                        <div>
                            {
                                itemData?.variants.map(
                                    (variant: any, i: number) =>
                                        <div key={variant.id} className="radio-button-item">
                                            <input type="radio" name="id-type"
                                                id={variant.id}
                                                value={variant.id}
                                                checked={variant.id == variantID}
                                                onChange={(event: ChangeEvent) => handleVariantChange(event, i)} />
                                            <label htmlFor={variant.id} className="config-select">
                                                <span>{variant.title}</span>
                                            </label>
                                        </div>
                                )
                            }
                        </div>

                    </div>
                    <div dangerouslySetInnerHTML={{ __html: itemData?.description }} />
                </div>
                <div className="footer">
                    <button>Add to Cart</button>
                    {
                        isDiscountable 
                        ? secretPWVisible
                            ? <SecretPassword variantID={variantID} callBack={setIsDiscountable}/>
                            : <button onClick={handleSecretPassword}>Use a Secret Password</button> 
                        : null
                    }

                </div>
            </div>
        </div>
    )
}