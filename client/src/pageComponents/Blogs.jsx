import React from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Blogs = () => {
    const featuredArticles = [
        {
            title: "How to Choose the Perfect Roommate",
            description: "A comprehensive guide to finding your ideal living partner",
            category: "Roommate Selection",
            readTime: "8 min read",
            date: "2024-12-20"
        },
        {
            title: "Ultimate Moving Checklist",
            description: "Everything you need to know before moving in with roommates",
            category: "Moving Tips",
            readTime: "6 min read",
            date: "2024-12-18"
        },
        {
            title: "Budgeting 101 for Shared Living",
            description: "Master the art of managing shared expenses",
            category: "Finance",
            readTime: "10 min read",
            date: "2024-12-15"
        }
    ];

    const categories = [
        "All",
        "Roommate Selection",
        "Moving Tips",
        "Finance",
        "Conflict Resolution",
        "House Rules",
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header Section */}
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-gray-900">Blog & Resources</h1>
                    <p className="text-lg text-gray-600">
                        Discover tips, guides, and advice for successful shared living
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-xl mx-auto">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                        placeholder="Search articles and resources..."
                        className="pl-10 h-12"
                    />
                </div>

                {/* Category Tabs */}
                <Tabs defaultValue="All" className="w-full flex flex-wrap justify-center">
                    <div className="overflow-x-auto">
                        <TabsList className="flex flex-nowrap justify-start gap-2 sm:gap-4 md:gap-6">
                            {categories.map((category) => (
                                <TabsTrigger
                                    key={category}
                                    value={category}
                                    className="px-4 py-2 text-sm md:text-base whitespace-nowrap"
                                >
                                    {category}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <TabsContent value="All" className="mt-6">
                        {/* Featured Articles Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredArticles.map((article, index) => (
                                <Card key={index} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <Badge variant="secondary">{article.category}</Badge>
                                            <span className="text-sm text-gray-500">{article.readTime}</span>
                                        </div>
                                        <CardTitle className="mt-2">{article.title}</CardTitle>
                                        <CardDescription>{article.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">
                                                {new Date(article.date).toLocaleDateString()}
                                            </span>
                                            <Button variant="outline" size="sm">
                                                Read More
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Newsletter Subscription */}
                        <Card className="mt-12">
                            <CardHeader>
                                <CardTitle>Stay Updated</CardTitle>
                                <CardDescription>
                                    Subscribe to our newsletter for the latest tips and guides
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-4">
                                    <Input placeholder="Enter your email" className="max-w-md" />
                                    <Button>Subscribe</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Blogs;