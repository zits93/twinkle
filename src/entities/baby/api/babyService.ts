/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@shared/api/supabase';
import type { BabyProfile } from '@shared/types/record';

const mapToEntity = (row: any /* eslint-disable-line @typescript-eslint/no-explicit-any */): BabyProfile => ({
  id: row.id,
  name: row.name,
  birthDate: row.birth_date,
  gender: row.gender === 'boy' ? 'M' : 'F',
  colorTheme: row.color_theme,
  profileImageUrl: row.profile_image_url,
});

export const babyService = {
  /**
   * 사용자의 가족 ID를 가져오거나 없으면 새로 생성합니다.
   */
  async getOrCreateFamily() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('인증이 필요합니다.');

    // 1. 이미 소속된 가족이 있는지 확인
    // maybeSingle()은 여러 줄이 반환되면 에러를 발생시키므로, limit(1)을 사용하여 안전하게 가져옵니다.
    const { data: members, error: mCheckError } = await supabase
      .from('family_members')
      .select('family_id')
      .eq('user_id', user.id)
      .limit(1);

    if (mCheckError) {
      console.error('가족 멤버 확인 중 오류:', mCheckError);
    }

    if (members && members.length > 0) {
      return members[0].family_id;
    }

    // 2. 소속된 가족이 없다면 새로 생성
    const { data: family, error: fError } = await supabase
      .from('families')
      .insert([{ name: `${user.email?.split('@')[0]}님의 가족` }])
      .select()
      .single();

    if (fError) {
      console.error('가족 생성 중 오류:', fError);
      throw fError;
    }

    // 3. 생성된 가족에 자신을 멤버(owner)로 추가
    const { error: mError } = await supabase
      .from('family_members')
      .insert([{ family_id: family.id, user_id: user.id, role: 'owner' }]);

    if (mError) {
      console.error('가족 멤버 추가 중 오류:', mError);
      throw mError;
    }

    return family.id;
  },

  async fetchBabies() {
    try {
      const familyId = await this.getOrCreateFamily();
      const { data, error } = await supabase
        .from('babies')
        .select('*')
        .eq('family_id', familyId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data || []).map(mapToEntity);
    } catch (e) {
      console.error('아기 목록을 불러오는 중 오류 발생:', e);
      return [];
    }
  },

  async createBaby(baby: Omit<BabyProfile, 'id'>) {
    const familyId = await this.getOrCreateFamily();
    const { data, error } = await supabase
      .from('babies')
      .insert([{
        name: baby.name,
        birth_date: baby.birthDate,
        gender: baby.gender === 'M' ? 'boy' : 'girl',
        color_theme: baby.colorTheme,
        profile_image_url: baby.profileImageUrl,
        family_id: familyId,
      }])
      .select();

    if (error) throw error;
    if (!data || data.length === 0) throw new Error('아기 생성에 실패했습니다.');
    return mapToEntity(data[0] as BabyRow);
  },

  async updateBaby(babyId: string, updates: Partial<BabyProfile>) {
    const dbUpdates: Record<string, string | null> = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.birthDate) dbUpdates.birth_date = updates.birthDate;
    if (updates.gender) dbUpdates.gender = updates.gender === 'M' ? 'boy' : 'girl';
    if (updates.colorTheme) dbUpdates.color_theme = updates.colorTheme;
    if (updates.profileImageUrl !== undefined) dbUpdates.profile_image_url = updates.profileImageUrl;

    const { data, error } = await supabase
      .from('babies')
      .update(dbUpdates)
      .eq('id', babyId)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) throw new Error('아기 정보 수정에 실패했습니다.');
    return mapToEntity(data[0] as any);
  },

  async deleteBaby(babyId: string) {
    const { error } = await supabase
      .from('babies')
      .delete()
      .eq('id', babyId);

    if (error) throw error;
  }
};
