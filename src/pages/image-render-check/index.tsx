import { useEffect, useState } from "react";

export default function ImageRenderCheck() {
    const [loadTimeNetlify, setLoadTimeNetlify] = useState(0);
    const [loadTimeRegular, setLoadTimeRegular] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [imageSizeNetlify, setImageSizeNetlify] = useState({ width: 0, height: 0 });
    const [imageSizeRegular, setImageSizeRegular] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setStartTime(new Date().getTime());
    }, []);

    const handleImageLoadNetlify = async (event: { target: { naturalWidth: number; naturalHeight: number; }; }) => {
        const finishTime = new Date().getTime();
        setLoadTimeNetlify((finishTime - startTime) / 1000);
        setImageSizeNetlify({ width: event.target.naturalWidth, height: event.target.naturalHeight });
    };

    const handleImageLoadRegular = async (event: { target: { naturalWidth: number; naturalHeight: number; }; }) => {
        const finishTime = new Date().getTime();
        setLoadTimeRegular((finishTime - startTime) / 1000);
        setImageSizeRegular({ width: event.target.naturalWidth, height: event.target.naturalHeight });
    };

    const image = 'https://d2w7f1pl8j4yzn.cloudfront.net/growth/onboarding-guide/task-persons/task-expense_policy.png';
    const netlifyImage = `https://deploy-preview-9--workshop-rc-2024.netlify.app/.netlify/images?url=${image}`;

    const heavyImage = "https://upload.wikimedia.org/wikipedia/commons/f/ff/Pizigani_1367_Chart_10MB.jpg";
    const netlifyHeavyImage = `https://deploy-preview-9--workshop-rc-2024.netlify.app/.netlify/images?url=${heavyImage}`;
    return (
        <>
            <div className="images-check">
                <div className="div1">
                    <b>Netlify image</b>
                    <p>Image load time: {loadTimeNetlify.toFixed(3)} s</p>
                    <p>Image size: {imageSizeNetlify.width}x{imageSizeNetlify.height}</p>
                    <img src={netlifyImage} onLoad={() => handleImageLoadNetlify} />
                </div>
                <div className="div2">
                    <b>Regular image</b>
                    <p>Image load time: {loadTimeRegular.toFixed(3)} s</p>
                    <p>Image size: {imageSizeRegular.width}x{imageSizeRegular.height}</p>
                    <img src={image} onLoad={() => handleImageLoadRegular} />
                </div>
            </div>

            <br/>
            <b>Heavy image 10MB check</b>
            <div className="images-check">
                <div className="div1">
                    <b>Netlify image</b>
                    <p>Image load time: {loadTimeNetlify.toFixed(3)} s</p>
                    <p>Image size: {imageSizeNetlify.width}x{imageSizeNetlify.height}</p>
                    <img src={netlifyHeavyImage} onLoad={() => handleImageLoadNetlify} />
                </div>
                <div className="div2">
                    <b>Regular image</b>
                    <p>Image load time: {loadTimeRegular.toFixed(3)} s</p>
                    <p>Image size: {imageSizeRegular.width}x{imageSizeRegular.height}</p>
                    <img src={heavyImage} onLoad={() => handleImageLoadRegular} />
                </div>
            </div>
        </>
    )
}