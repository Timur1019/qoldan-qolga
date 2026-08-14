import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { adsApi, chatApi } from '@/api/client';
import { TabBarBadge } from '@/components/TabBarBadge/TabBarBadge';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';

function useTabBadges() {
  const { isAuthenticated } = useAuth();
  const [chatUnread, setChatUnread] = useState(0);
  const [sellCount, setSellCount] = useState(0);

  const refresh = useCallback(() => {
    if (!isAuthenticated) {
      setChatUnread(0);
      setSellCount(0);
      return;
    }
    chatApi
      .getConversations()
      .then((list) => {
        const arr = Array.isArray(list) ? list : [];
        const total = arr.reduce((sum: number, c: { unreadCount?: number }) => sum + (c.unreadCount || 0), 0);
        setChatUnread(total);
      })
      .catch(() => setChatUnread(0));
    adsApi
      .myAds({ size: 50 })
      .then((res) => {
        const page = res as { content?: unknown[] };
        const content = Array.isArray(page?.content) ? page.content : Array.isArray(res) ? (res as unknown[]) : [];
        setSellCount(content.length);
      })
      .catch(() => setSellCount(0));
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
    if (!isAuthenticated) return;
    const id = setInterval(refresh, 30000);
    return () => clearInterval(id);
  }, [isAuthenticated, refresh]);

  return { chatUnread, sellCount };
}

export default function TabsLayout() {
  const { chatUnread, sellCount } = useTabBadges();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 10);
  const tabBarHeight = 52 + bottomPad;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600', color: colors.text },
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.bg,
          height: tabBarHeight,
          paddingBottom: bottomPad,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginBottom: 0,
        },
        tabBarItemStyle: {
          paddingTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.search'),
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="search-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t('tabs.favorites'),
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sell"
        options={{
          title: t('tabs.sell'),
          headerShown: false,
          tabBarIcon: ({ focused, size }) => (
            <TabBarBadge count={sellCount}>
              <View
                style={{
                  width: size + 8,
                  height: size + 8,
                  borderRadius: (size + 8) / 2,
                  backgroundColor: focused ? colors.primary : colors.text,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="add" size={size} color={colors.white} />
              </View>
            </TabBarBadge>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: t('tabs.chat'),
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <TabBarBadge count={chatUnread}>
              <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
            </TabBarBadge>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
