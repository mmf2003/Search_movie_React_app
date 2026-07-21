import SkeletonCard from "../SkeletonCard/SkeletonCard";
import "./SkeletonList.css";

function SkeletonList({ count = 8 }) {
    return (
        <div
            className="skeleton-list"
            role="status"
            aria-label="Uploading Movies"
        >
            {Array.from({ length: count }, (_, index) => (
                <SkeletonCard key={index} />
            ))}

            <span className="visually-hidden">Downloading movies...</span>
        </div>
    );
}

export default SkeletonList;
