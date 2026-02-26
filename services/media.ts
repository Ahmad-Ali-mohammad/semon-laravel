
import { MediaItem } from '../types';
import { api } from './api';

const normalizeMedia = (item: any): MediaItem => ({
  id: item.id,
  url: item.url,
  name: item.name,
  size: item.size || '',
  date: item.created_at ? new Date(item.created_at).toLocaleDateString('ar-SY') : ''
});

export const mediaService = {
  async getImages(): Promise<MediaItem[]> {
    const data = await api.getMedia();
    return (data || []).map(normalizeMedia);
  },

  async uploadImage(file: File): Promise<MediaItem> {
    const media = await api.uploadMedia(file);
    return normalizeMedia(media);
  },

  async deleteImage(id: string) {
    await api.deleteMedia(id);
    return true;
  }
};
