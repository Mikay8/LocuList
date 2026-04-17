const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
const AUTOCOMPLETE_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';

export function hasGooglePlacesApiKey() {
  return Boolean(GOOGLE_PLACES_API_KEY);
}

export async function fetchGoogleAddressSuggestions(input) {
  const query = input?.trim();

  if (!GOOGLE_PLACES_API_KEY || !query || query.length < 3) {
    return [];
  }

  const params = new URLSearchParams({
    input: query,
    key: GOOGLE_PLACES_API_KEY,
    types: 'address',
    language: 'en',
  });

  const response = await fetch(`${AUTOCOMPLETE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Google Places request failed with ${response.status}`);
  }

  const payload = await response.json();

  if (payload.status === 'OK') {
    return payload.predictions.map(prediction => ({
      id: prediction.place_id,
      title: prediction.structured_formatting?.main_text ?? prediction.description,
      subtitle: prediction.structured_formatting?.secondary_text ?? '',
      description: prediction.description,
    }));
  }

  if (payload.status === 'ZERO_RESULTS') {
    return [];
  }

  throw new Error(payload.error_message || `Google Places status: ${payload.status}`);
}