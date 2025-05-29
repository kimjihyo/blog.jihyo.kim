export function Banner() {
  return (
    // backgroundImage: "linear-gradient(to right, #8f94fb, #4e54c8)",
    <div className="bg-linear-to-r from-blue-400 to-blue-700 text-white p-4 rounded-lg w-full h-20 lg:h-30">
      <div className="flex items-center justify-center h-full">
        <div className="text-xl lg:text-2xl font-semibold">
          <span className="font-black text-white">blog</span>
          <span className="text-white opacity-60">.jihyo.kim</span>
        </div>
      </div>
    </div>
  );
}
