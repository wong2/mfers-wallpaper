import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import useSWR from "swr";
import Loading from "../components/Loading";

function fetcher(url: string) {
  return fetch(url).then((r) => r.json());
}

function getApiUrl(id: string) {
  return `https://nft-api-five.vercel.app/api/metadata?contract_address=0x79fcdef22feed20eddacbb2587640e45491b757f&token_id=${id}`;
}

function getCanvasSize() {
  let w: number | string = window.screen.width * window.devicePixelRatio;
  let h: number | string = window.screen.height * window.devicePixelRatio;
  if (w > h) {
    // on desktop
    h = window.innerHeight;
    w = h / 2;
  }
  return { width: w, heigth: h };
}

const Canvas: FC<{ image: HTMLImageElement }> = ({ image }) => {
  const [result, setResult] = useState("");

  useEffect(() => {
    const { width, heigth } = getCanvasSize();
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = heigth;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(image, 0, 0);
    const { data: bgColor } = ctx.getImageData(100, 100, 1, 1);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = `rgb(${bgColor[0]},${bgColor[1]},${bgColor[2]})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const imageSize = Math.floor((canvas.width * 6) / 7);
    ctx.drawImage(image, canvas.width - imageSize, canvas.height - imageSize, imageSize, imageSize);

    const dataUrl = canvas.toDataURL("image/png");
    setResult(dataUrl);
  }, [image]);

  if (!result) {
    return <Loading />;
  }

  return <img src={result} />;
};

const WallpaperPage: FC = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const { data } = useSWR(id ? getApiUrl(id) : null, fetcher);

  useEffect(() => {
    if (!data?.image) {
      return;
    }
    const img = new Image();
    img.onload = function () {
      setImage(img);
    };
    img.crossOrigin = "Anonymous";
    img.src = data.image;
  }, [data?.image]);

  if (!id || !data || !image) {
    return <Loading />;
  }

  return <Canvas image={image} />;
};

export default WallpaperPage;
