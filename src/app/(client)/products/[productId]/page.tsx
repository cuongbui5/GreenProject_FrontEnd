"use client"
import {useEffect, useState} from 'react';

import styles from './Product.module.css'
import {PaginationProps, Spin} from 'antd';
import {getProductById, getAllProductsView} from "@/apis/modules/product";
import ReviewComponent from './component/ReviewComponent';
import ImageComponent from './component/ImageComponent';
import ProductInfoComponent from './component/ProductInfoComponent';
import RelatedProductComponent from './component/RelatedProductComponent';
import {getAllProductItemByProductId} from "@/apis/modules/product_item";
import axios from "axios";

export default function page({params}:any) {
    const [product,setProduct]=useState<any>(null);
    const [productItems,setProductItems]=useState<any>([]);
    const [relatedProduct,setRelatedProduct] = useState<any>(null);
    const [loading,setLoading]=useState(false);


    const getProductData = async (productId: number) => {
        setLoading(true);

        try {
            const [productRes, productItemsRes]:any = await axios.all([
                getProductById(productId),
                getAllProductItemByProductId(productId)
            ]);
            console.log(productRes, productItemsRes);


            if (productRes.code === 200) {
                setProduct(productRes.data);

                getRelatedProduct(1,productRes.data.category.id)
            }

            if (productItemsRes.code === 200) {
                setProductItems(productItemsRes.data);
            }


        } catch (error) {
            console.error("Error fetching product data:", error);
        } finally {
            setLoading(false);
        }
    };

    const getRelatedProduct = async (pageNum:number, categoryId: number)=>{
        const res:any = await getAllProductsView(pageNum,"",categoryId);
        console.log(res)
        if(res.code ==200){
            setRelatedProduct(res.data.content);
        }
    }

    useEffect(() => {
        getProductData(params.productId)
    }, []);

    const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
        console.log(current, pageSize);
      };

    return (
        <div style={{width:'1200px',marginLeft:'auto',marginRight:'auto',marginBottom:'2rem'}}>
            {loading ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    <div className={styles.gridContainer}>
                        <ImageComponent product={product} />
                        <ProductInfoComponent product={product} productItems={productItems} />
                        <ReviewComponent />
                    </div>
                    <RelatedProductComponent relatedProduct={relatedProduct} />
                </>
            )}

        </div>
    );
}