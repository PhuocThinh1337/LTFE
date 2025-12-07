"use client"

import { useState } from "react"

export default function RoomInspirationSection() {
    const [currentIndex, setCurrentIndex] = useState(0)

    const rooms = [
        {
            title: "Modern Living",
            description: "Soft teal walls create a serene living space",
            image: "/modern-living-room-with-teal-walls.jpg",
        },
        {
            title: "Cozy Bedroom",
            description: "Warm beige tones for a relaxing bedroom",
            image: "/cozy-bedroom-interior-design.jpg",
        },
        {
            title: "Vibrant Kitchen",
            description: "Fresh green walls brighten your cooking space",
            image: "/modern-kitchen-with-green-walls.jpg",
        },
    ]

    const nextRoom = () => {
        setCurrentIndex((prev) => (prev + 1) % rooms.length)
    }

    const prevRoom = () => {
        setCurrentIndex((prev) => (prev - 1 + rooms.length) % rooms.length)
    }

    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Room Inspiration</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        See how our colors transform different spaces
                    </p>
                </div>

                {/* Main Image Carousel */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-8 max-w-4xl mx-auto">
                    <div className="relative w-full" style={{ paddingBottom: "66.67%" }}>
                        <img
                            src={rooms[currentIndex].image || "/placeholder.svg"}
                            alt={rooms[currentIndex].title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevRoom}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-3 rounded-full shadow-lg transition z-10"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextRoom}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-3 rounded-full shadow-lg transition z-10"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Slide Info and Thumbnails */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-card p-8 rounded-2xl mb-8">
                        <h3 className="text-2xl font-bold mb-2">{rooms[currentIndex].title}</h3>
                        <p className="text-muted-foreground">{rooms[currentIndex].description}</p>
                    </div>

                    {/* Thumbnail Navigation */}
                    <div className="flex gap-4 justify-center">
                        {rooms.map((room, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`relative overflow-hidden rounded-lg transition ${
                                    idx === currentIndex ? "ring-2 ring-primary" : "ring-2 ring-border"
                                }`}
                            >
                                <img
                                    src={room.image || "/placeholder.svg"}
                                    alt={room.title}
                                    className="w-24 h-24 object-cover hover:scale-110 transition"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
