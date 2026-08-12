import * as React from "react";
import { Info, Bookmark, BookmarkCheck } from "lucide-react";
import { BiasMeter } from "./bias-meter";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";

export interface ArticleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  image?: string;
  category: string;
  country: string;
  title: string;
  excerpt: string;
  bias: { left: number; center: number; right: number };
  timeAgo: string;
  readTime: string;
  sentiment?: "left" | "center" | "right" | "neutral";
}

export const ArticleCard = ({
  image,
  category,
  country,
  title,
  excerpt,
  bias,
  timeAgo,
  readTime,
  sentiment = "neutral",
  className,
  ...props
}: ArticleCardProps) => {
  const [bookmarked, setBookmarked] = React.useState(false);

  return (
    <div
      className={cn(
        "flex flex-col bg-bg-primary rounded-lg border border-border overflow-hidden hover:shadow-md transition-all duration-300 w-full max-w-[400px]",
        className
      )}
      {...props}
    >
      {/* Article Image */}
      {image && (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-bg-secondary select-none">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex gap-1.5">
            <Badge variant={sentiment}>{sentiment}</Badge>
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="flex flex-col p-5 flex-grow">
        {/* Category & Country Meta */}
        <div className="text-caption font-semibold tracking-widest text-text-secondary uppercase select-none mb-2">
          {category} &middot; {country}
        </div>

        {/* Title */}
        <h3 className="text-h4 font-bold text-text-primary mb-2 line-clamp-2 hover:text-accent transition-colors cursor-pointer">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-body-sm text-text-secondary mb-5 line-clamp-3">
          {excerpt}
        </p>

        {/* Bias Meter Section */}
        <div className="mt-auto pt-4 border-t border-divider">
          <BiasMeter left={bias.left} center={bias.center} right={bias.right} className="mb-4" />

          {/* Bottom Meta Row */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-divider select-none">
            <div className="text-caption text-text-secondary font-medium">
              {timeAgo} &bull; {readTime}
            </div>
            
            {/* Interactive Icons */}
            <div className="flex items-center gap-3 text-text-secondary">
              <button
                className="hover:text-text-primary transition-colors p-1 rounded-sm focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
                title="Bias Info"
              >
                <Info size={16} />
              </button>
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={cn(
                  "hover:text-text-primary transition-colors p-1 rounded-sm focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer",
                  bookmarked ? "text-accent" : "text-text-secondary"
                )}
                title={bookmarked ? "Bookmarked" : "Bookmark"}
              >
                {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
