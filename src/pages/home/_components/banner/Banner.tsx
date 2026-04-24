type BannerProps = {
  images: string[];
};

function Banner({ images }: BannerProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full my-12">
      {images.map((src, index) => (
        <div
          key={index}
          className="w-full h-56 rounded-xl overflow-hidden shadow-md"
        >
          <img
            src={src}
            alt={`banner-${index}`}
            className="w-full h-full object-fit hover:scale-105 transition-transform duration-300"
          />
        </div>
      ))}
    </div>
  );
}

export default Banner;
