export function Banner() {
  return (
    // backgroundImage: "linear-gradient(to right, #8f94fb, #4e54c8)",
    <div className="h-20 w-full rounded-lg bg-linear-to-r from-blue-400 to-blue-700 p-4 text-white lg:h-30">
      <div className="flex h-full items-center justify-center">
        <div className="text-xl font-semibold lg:text-2xl">
          <span className="font-black text-white">blog</span>
          <span className="text-white opacity-60">.jihyo.kim</span>
        </div>
      </div>
    </div>
  );
}
