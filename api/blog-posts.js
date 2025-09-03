// Simple blog posts endpoint for Vercel
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Return hardcoded blog posts that will always work
    const blogPosts = [
      {
        id: "1",
        title: "Vårt Første NEIPA Brygg",
        summary: "En dyptykk i vår første erfaring med å brygge en New England IPA. Lærdommer, utfordringer og triumfer.",
        content: "New England IPA har blitt en av våre favorittøl å brygge. I dette innlegget deler vi vår erfaring med å brygge vår første NEIPA, inkludert ingrediensene vi brukte, bryggeprosessen, og hva vi lærte underveis.",
        imageUrl: "https://images.unsplash.com/photo-1608270586620-248524c67de9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        published: true,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z"
      },
      {
        id: "2",
        title: "Temperaturkontroll under gjæring",
        summary: "Hvorfor er stabil temperatur så viktig? Vi deler våre beste tips for perfekt gjæring hver gang.",
        content: "Temperaturkontroll er kritisk for å oppnå konsistente resultater i hjemmebryggeriet. Her deler vi våre metoder for å holde stabil temperatur gjennom hele gjæringsprosessen.",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        published: true,
        createdAt: "2024-01-10T14:20:00Z",
        updatedAt: "2024-01-10T14:20:00Z"
      },
      {
        id: "3",
        title: "RAPT.io: En Game Changer",
        summary: "Hvordan sanntidsdata fra RAPT.io har forandret måten vi brygger på. En oversikt over verktøyet.",
        content: "RAPT.io har revolusjonert måten vi overvåker våre brygg på. Med sanntidsdata og fjernkontroll har vi oppnådd bedre konsistens og kvalitet i våre øl.",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        published: true,
        createdAt: "2024-01-05T16:45:00Z",
        updatedAt: "2024-01-05T16:45:00Z"
      }
    ];

    return res.json(blogPosts);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}