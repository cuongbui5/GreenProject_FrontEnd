"use client"
import React, {useEffect, useState} from 'react';
import {Flex, message, Radio, Rate} from 'antd';
import {MinusOutlined, PlusOutlined, ShoppingCartOutlined, StockOutlined, TagOutlined} from '@ant-design/icons';
import {DeepSet} from "@/app/util/DeepSet";
import {useReviewStore} from "@/app/store/ReviewStore";
import {addCart} from "@/apis/modules/item";
import {handleApiRequest} from "@/app/util/utils";
import {createOrderByNow} from "@/apis/modules/order";
import {useOrderStore} from "@/app/store/OderStore";
import {useRouter} from "next/navigation";
import styles from '../Product.module.css'
import {useCartStore} from "@/app/store/CartStore";

const ProductInfoComponent:React.FC<any> = ({ product,productItems }) => {
    const [qty,setQty]=useState(1);
    const [productItem,setProductItem]=useState<any>(null)
    const [variations,setVariations]=useState([]);
    const [optionData,setOptionData]=useState([]);
    const {setOrder}=useOrderStore(state => state);


    /*------------------------------------- */
    const {
        setCurrentProductItem,
      } = useReviewStore((state) => state);
    /*------------------------------------- */
      
    useEffect(() => {
        const aggregateVariationOptions = (productItems:any) => {
            const variationMap: { [key: string]: DeepSet<any> } = {};

            productItems.forEach((product:any )=> {
                product.variationOptions.forEach((option:any) => {
                    const variationName = option.variation.name;
                    const variationOption = { id: option.id, value: option.value };


                    if (!variationMap[variationName]) {
                        variationMap[variationName] = new DeepSet();
                    }


                    variationMap[variationName].add(variationOption);
                });
            });


            const aggregatedVariations:any = Object.entries(variationMap).map(([name, values]) => ({
                name,
                values: Array.from(values)
            }));
            aggregatedVariations.sort((a: any, b: any) => a.values.length - b.values.length);

            return aggregatedVariations;
        };
        if (productItems) {
            const result = aggregateVariationOptions(productItems);
            const defaultOptions = result.map((v: any) => ({
                name: v.name,
                id: v.values[0]?.id
            }));
            setOptionData(defaultOptions);
            setVariations(result);
        }
    }, [product]);

    useEffect(() => {
        const foundItem = findProductItemByOptions();
        setProductItem(foundItem);
    }, [optionData, product]);

    const findProductItemByOptions = () => {
        if (productItems) {
            const optionIds = optionData.map((o: any) => o.id);
            console.log(optionIds);


            const foundProductItem =productItems.find((item: any) => {
                return optionIds.every(optionId =>
                    item.variationOptions.some((variation: any) => variation.id === optionId)
                );
            });

            /*------------------------------------- */
            if(foundProductItem){
                setCurrentProductItem(foundProductItem)
                console.log(foundProductItem)
            }
            /*------------------------------------- */


            return foundProductItem || null;
        }
        return null;
    };

    const handleOptionChange = (variationName: string, valueId: number) => {

        setOptionData((prev:any) => {
            return prev.map((opt: any) => {
                if (opt.name === variationName) {
                    return {...opt, id: valueId};
                }
                return opt;
            });
        });

    };
    const {addToCart}=useCartStore(state => state);


    async function handleAddCart() {
        if(!productItem){
            message.warning("Chưa có mặt hàng này!")
            return;
        }
        const data:any={productItemId:productItem.id,quantity:qty}
        await addToCart(data);



    }
    const router = useRouter();

    async function handleByNow() {
        if(!productItem){
            message.warning("Chưa có mặt hàng này!")
            return;
        }
        const data:any={productItemId:productItem.id,quantity:qty}
        const apiCall=()=> createOrderByNow(data);
        await handleApiRequest(apiCall,(response:any)=>{
            console.log(response)
            setOrder(response.data);
            router.replace(`/payment?orderId=${response.data.id}`)
        })

    }

    return (
        <Flex vertical style={{gridArea: 'product-info'}} gap={"middle"}>

            <div style={{gridArea: 'title', fontSize: '2rem', fontWeight: '600'}}>
                {product?.name}
            </div>

            {
                !productItem?(
                    <div>Chưa có mặt hàng này! </div>
                    ): (
                    <div style={{
                        padding: '20px',
                        border: '1px solid #e8e8e8',
                        borderRadius: '12px',
                        backgroundColor: '#fff',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        gridGap: '10px'
                    }}>
                        <div style={{gridColumn: '1 / 3', marginBottom: '15px'}}>
                            <Rate allowHalf value={productItem.totalRating / productItem.reviewCount} disabled/>
                            <span style={{
                                marginLeft: 10,
                                fontSize: '0.9rem',
                                color: '#666'
                            }}>{productItem.reviewCount} đánh giá</span>
                        </div>

                        <div style={{
                            gridColumn: '1 / 2',
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            color: '#4BAF47',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <TagOutlined style={{marginRight: '5px', color: '#4BAF47'}}/>
                            <span>{"Giá: " + productItem.price.toLocaleString() + " VND"}</span>
                        </div>

                        <div style={{
                            gridColumn: '2 / 3',
                            fontSize: '1.3rem',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <ShoppingCartOutlined style={{marginRight: '5px', color: '#1890ff'}}/>
                            <span>{"Đã bán: " + productItem.sold}</span>
                        </div>

                        <div style={{
                            gridColumn: '1 / 2',
                            fontSize: '1.3rem',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <StockOutlined style={{marginRight: '5px', color: '#ff4d4f'}}/>
                            <span>{"Kho: " + productItem.quantity}</span>
                        </div>
                    </div>

                )
            }


            <div style={{gridArea: 'variation'}}>
                <Flex gap={"small"} vertical>
                    {variations && variations.map((variation: any) => (
                        <Flex vertical gap={"small"} key={variation.name}>
                            <p>Chọn {variation.name}</p>
                            <Radio.Group
                                onChange={(e) => handleOptionChange(variation.name, e.target.value)}
                                defaultValue={variation.values[0].id}

                            >
                                <div style={{display: 'flex', gap: '1rem'}}>
                                    {variation.values.map((value: any) => (
                                        <Radio.Button
                                            key={`${variation.name}-${value.id}`} // Sử dụng `id` để tạo key duy nhất
                                            value={value.id}
                                        >
                                            {value.value}
                                        </Radio.Button>
                                    ))}
                                </div>
                            </Radio.Group>
                        </Flex>
                    ))}
                </Flex>
            </div>

            <div style={{gridArea: 'quantity'}}>
                <Flex vertical gap={"small"}>
                    <p>Choose quantity</p>
                    <Flex gap={"small"}>
                        <button onClick={() => {
                            setQty((st: number) => {
                                if (qty == 1) {
                                    return st;
                                }
                                return st - 1;
                            })
                        }} style={{border: '1px solid #000', borderRadius: '8px', width: '40px', height: '40px'}}>
                            <MinusOutlined style={{fontSize: '0.8rem', color: '#ff4d4f'}}/>
                        </button>
                        <input className={styles.numberInput} type='number' onChange={() => console.log("change quantity")} value={qty} style={{
                            border: '1px solid #000',
                            borderRadius: '8px',
                            width: '40px',
                            height: '40px',
                            textAlign: 'center',
                            display: 'inline-flex'
                        }}/>
                        <button
                            onClick={() => {
                                setQty((st: number) => {
                                    return st + 1;
                                })
                            }} style={{border: '1px solid #000', borderRadius: '8px', width: '40px', height: '40px'}}>
                            <PlusOutlined style={{fontSize: '0.8rem', color: '#ff4d4f'}}/>
                        </button>
                    </Flex>
                </Flex>
            </div>
            <Flex gap="middle" align="flex-start">
                <button onClick={handleAddCart}
                    className={styles.addToCartButton}>
                    Thêm vào giỏ hàng
                </button>
                <button
                    onClick={handleByNow}
                    className={styles.commonButton}>
                    Mua ngay
                </button>
            </Flex>
            <div style={{gridArea: 'info'}}>
                <Flex vertical gap={"middle"}>
                    <div style={{gridArea: 'description'}}>
                        <p style={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            WebkitLineClamp: 15
                        }}>
                           Mô tả: {product?.description}

                        </p>
                    </div>
                </Flex>
            </div>
        </Flex>
    );
};

export default ProductInfoComponent;