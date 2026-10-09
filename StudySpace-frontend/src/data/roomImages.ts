import type { ImageSource } from 'expo-image';

const unsplash = (photoId: string): ImageSource => ({
  uri: `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1200&q=85`,
});

/** Temporary remote sources from the spec. After the UI milestone, replace with local assets. */
const ROOM_IMAGES: Readonly<Record<string, ImageSource>> = {
  'lab-a3-101': unsplash('photo-1497366811353-6870744d04b2'),
  'library-zone-b': unsplash('photo-1741707596397-efaae09503b5'),
  'collab-studio-4': unsplash('photo-1628062699790-7c45262b82b4'),
  'reading-room-2': unsplash('photo-1637455587265-2a3c2cbbcc84'),
  'lab-a3-102': unsplash('photo-1789654499247-67ddedd251cc'),
  'study-room-b2-201': unsplash('photo-1495576775051-8af0d10f19b1'),
  'study-room-b2-202': unsplash('photo-1661169399398-dd271af8f651'),
  'library-zone-c': unsplash('photo-1789654499248-bf7d80de86d4'),
  'research-room-c1': unsplash('photo-1758413350815-7b06dbbfb9a7'),
  'meeting-room-d1': unsplash('photo-1431540015161-0bf868a2d407'),
  'multimedia-room-e2': unsplash('photo-1497366858526-0766cadbe8fa'),
  'quiet-study-f1': unsplash('photo-1737018363337-c11847e9f39b'),
  'collaboration-room-g3': unsplash('photo-1637665662134-db459c1bbb46'),
  'seminar-room-h1': unsplash('photo-1503423571797-2d2bb372094a'),
};

export function getRoomImage(roomId: string): ImageSource {
  return ROOM_IMAGES[roomId];
}