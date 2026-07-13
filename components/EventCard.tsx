"use client";
import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";

interface Proprs {
  image: string;
  title: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

function EventCard({ image, title, slug, location, date, time }: Proprs) {
  const handleClick = () => {
    posthog.capture("event_card_clicked", {
      event_title: title,
      event_slug: slug,
      event_location: location,
      event_date: date,
    });
  };

  return (
    <>
      <Link href={`/events${slug}`} id="event-card" onClick={handleClick}>
        <Image
          src={image}
          alt={title}
          width={410}
          height={300}
          className="poster"
        />
        <div className="flex flex-row gap-2">
          <Image src="/icons/pin.svg" alt="location" width={14} height={14} />
          {location}
        </div>
        <p className="title">{title}</p>

        <div className="datetime">
          <Image src="/icons/calendar.svg" alt="location" width={14} height={14} />
          {date} |
          <Image src="/icons/clock.svg" alt="location" width={14} height={14} />
          {time}
        </div>
      </Link>
    </>
  );
}

export default EventCard;
