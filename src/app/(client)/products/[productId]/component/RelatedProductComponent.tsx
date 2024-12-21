
"use client"
import {useState} from 'react';
import React from 'react';
import { Flex, Card,Rate } from 'antd';
import Link from "next/link";

const RelatedProductComponent: React.FC<{ relatedProduct: any[] }> = ({ relatedProduct }) => {


    return (
        <Flex vertical gap={"middle"}>
            <h2 style={{ textTransform: 'uppercase', fontSize: '1.4rem', fontWeight: '600' }}>Sản phẩm liên quan</h2>
            <Flex wrap gap={"small"} justify='flex-start' align='center'>
                {/* Kiểm tra nếu relatedProduct tồn tại và là một mảng */}
                {relatedProduct && relatedProduct.length > 0 ? (
                    relatedProduct.map((product: any) => (
                        <Link key={product.id} href={`/products/${product.id}`}>
                            <Card 
                                key={product.id} // Add a unique key prop here
                                hoverable
                                style={{ width: 230, height: 350 }}
                                cover={<img src={product.imageCover} alt={product.name}  style={{
                                    width: '100%', 
                                    height: '240px', 
                                    objectFit: 'cover'
                                }}/>}                    
                            >
                                    <Flex vertical align="start">
                                        <div style={{ fontSize: "1.2rem", fontWeight: "600", whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                            {product.name}
                                        </div>
                                        <div style={{ color: "#4BAF47", fontWeight: "600" }}>
                                            {product.minPrice.toLocaleString('vi-VN')}đ - {product.maxPrice.toLocaleString('vi-VN')}đ
                                        </div>
                                        <div className="star">
                                            <Rate allowHalf defaultValue={product.totalRating/product.totalReviews} disabled />
                                        </div>
                                    </Flex>
                            </Card>
                        </Link>
                    ))
                ) : (
                    <div>Không có sản phẩm liên quan.</div>
                )}
            </Flex>
        </Flex>
    );
};

export default RelatedProductComponent;