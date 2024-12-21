"use client"
import React from 'react';
import {useEffect, useState} from 'react';
import {Flex, Row, Col, Rate, Pagination, Input, Image, Menu, message} from 'antd';
import {useReviewStore} from "@/app/store/ReviewStore";
import SockJS from "sockjs-client";
import Stomp from "stompjs";


const { TextArea } = Input;

const ReviewComponent = () => {

    const [rating, setRating] = useState(0); // Giá trị sao mặc định
    const [content, setContent] = useState('');


    const {
        current,totalElements,
        reviews,
        currentProductItem,
        getAllReviewByProductItemId,
        createReview,
    } = useReviewStore(state => state);

    const getAllReviewsByProductItemId=async (page:number)=>{
        await getAllReviewByProductItemId(page, currentProductItem.id);

    }

    useEffect(() => {
        if (currentProductItem) {
            getAllReviewsByProductItemId(current)
        }
    }, [currentProductItem]);

    useEffect(() => {
        if(currentProductItem){
            console.log(currentProductItem.id)
            const socket=new SockJS("http:/localhost:7000/ws");
            const client=Stomp.over(socket);
            client.connect({},()=>{
                client.subscribe(`/topic/reviews/productItem/${currentProductItem.id}`,message => {
                    const body = message.body;
                    if(body=="update"){
                        getAllReviewsByProductItemId(current)
                    }



                })
            })
            return ()=>{
                if(client.connected){
                    client.disconnect(()=>{})
                }

            }
        }






    }, [currentProductItem]);



     const handleSubmit =async () => {
        if(rating==0||content.trim()==""){
            message.warning("Data empty!")
            return;


        }
        const res:any=await createReview({rating:rating,content:content,productItemId:currentProductItem.id},currentProductItem.id)
        if(res){
            setRating(0)
            setContent("")
        }

    }

     const onPageChange =async (page: any) => {
         await getAllReviewsByProductItemId(page)

    }
    if(!currentProductItem){
        return <></>
    }


    return (
        <div>
            <Flex gap={'middle'} vertical>
                <h2 style={{ fontWeight: '600', fontSize: '1.5rem' }}>Đánh giá sản phẩm 

                    <span style={{ fontSize: '1.5rem', fontWeight: '700' }}> ({currentProductItem.reviewCount })</span>

                </h2>


                <>
                    <div className="review-container bg-white p-4 shadow-lg rounded-lg">
                        <div className="flex items-start gap-4">
                            <div className="avatar-container">
                                <Image
                                    width={48}
                                    height={48}
                                    src="/images/user_default.png"
                                    alt="Avatar"
                                    className="avatar rounded-full border border-gray-300"
                                />
                            </div>
                            <div className="flex flex-col w-full gap-3">
                                {/* Star rating */}
                                <div className="star flex items-center">
                                    <Rate
                                        value={rating}
                                        onChange={setRating}
                                        className="text-yellow-400"
                                    />
                                </div>

                                {/* TextArea for review */}
                                <TextArea
                                    placeholder="Nhập đánh giá của bạn..."
                                    className="custom-textarea border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg"
                                    rows={4}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Submit button */}
                        <div className="text-right mt-4">
                            <button
                                className="review-button bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                                onClick={handleSubmit}
                            >
                                Đánh giá
                            </button>
                        </div>
                    </div>
                </>


                <Flex vertical gap={"middle"}>
                    <Flex justify='space-between' align='center'>
                        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Bình luận gần đây</p>
                    </Flex>

                    {/* List of reviews */}
                    
                    {reviews && reviews.length > 0 ? (
                        reviews.map((review:any, index:any) => (
                            <Row key={index} gutter={[8, 8]} style={{ borderBottom: '1px solid #8c8b8b85', paddingBottom: '1rem' }}>
                                <Col span={4}>
                                    <Image
                                        src={review.user.imageUrl || "/images/user_default.png"}
                                        width={48}
                                        height={48}
                                        alt="Avatar"
                                        className="avatar"
                                    />
                                </Col>
                                <Col span={20}>
                                    <Flex vertical gap={"small"}>
                                        <Flex justify='space-between'>
                                            <div>{review.user.username}</div>
                                            <time>{new Date(review.updatedAt).toLocaleString('vi-VN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}</time>
                                        </Flex>
                                        <Flex className="star" gap={'small'}>
                                            <Rate allowHalf value={review.rating} disabled />
                                        </Flex>
                                        <p>{review.content}</p>
                                    </Flex>
                                </Col>
                            </Row>
                        ))
                    ) : (
                        <p>Không có bình luận nào</p> // Hiển thị thông báo khi không có bình luận
                    )}


                    {reviews.length>0&&<Pagination
                        style={{ marginTop: '1rem' }}
                        align='end'
                        showSizeChanger
                        onChange={onPageChange}
                        defaultCurrent={3}
                        total={totalElements}
                    />}
                </Flex>
            </Flex>
        </div>
    );
};

export default ReviewComponent;