import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { events } from "@/lib/constants";

export default function Home() {
  return (
    <section>
      <h1 className="text-center">
        the hub for every dev <br /> event you can't miss
        <p className="text-lg mt-4">
          heckthon, Meetups, and confrencess, All in one place
        </p>
      </h1>
      <ExploreBtn />

      <div className="mt-5">
        <h3>Featured Events</h3>

        <ul className="events">
          {events.map((event) => (
            <li key={event.title}>
              {/* <EventCard image={event.image} title={event.title} /> */}
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
