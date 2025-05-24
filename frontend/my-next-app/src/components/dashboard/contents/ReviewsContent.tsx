import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StoreReviewsPage from "./StoreReviewsPage"
import ProductReviewsPage from "./ProductReviewsPage"

export default function ReviewsContent() {
    return (
        <main className="flex-1 p-6">
            <Tabs defaultValue="store">
                <div className="flex justify-between items-center mb-6">
                    <TabsList className="bg-pink-100">
                        <TabsTrigger value="store" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                            Đánh giá cửa hàng
                        </TabsTrigger>
                        <TabsTrigger value="product" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                            Đánh giá sản phẩm
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="store">
                    <StoreReviewsPage />
                </TabsContent>

                <TabsContent value="product">
                    <ProductReviewsPage />
                </TabsContent>
            </Tabs>
        </main>
    )
} 