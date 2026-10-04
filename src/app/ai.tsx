import { useEffect, useState, type ReactNode } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import type { PurchasesPackage } from 'react-native-purchases';

import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/controls';
import { Icon, Icons } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Card, Pill, Row, Screen } from '@/components/ui/layout';
import { Text } from '@/components/ui/text';
import { Radius, Spacing } from '@/constants/theme';
import { useAiStatus } from '@/hooks/use-ai-status';
import { useTheme } from '@/hooks/use-theme';
import {
  getAvailability,
  getDeviceAvailability,
  prepareModel,
  testOpenRouter,
  type LlmAvailability,
} from '@/lib/ai/llm';
import { buyPlus, isPlusActive, plusAvailableInBuild, plusPackages, restorePlus, subscribePlus } from '@/lib/ai/plus';
import {
  aiProvider,
  hasCloudConsent,
  loadOpenRouterKey,
  MODEL_PRESETS,
  openRouterModel,
  saveOpenRouterKey,
  setAiProvider,
  setCloudConsent,
  setOpenRouterModel,
  type AiProvider,
} from '@/lib/ai/settings';

/** Chooses where the tutor runs: on-device, the learner's own OpenRouter key, or Hablo Plus. */
export default function AiTutorScreen() {
  const status = useAiStatus();
  const [provider, setProvider] = useState<AiProvider>(aiProvider);
  const [device, setDevice] = useState<LlmAvailability | null>(null);

  useEffect(() => {
    getDeviceAvailability().then(setDevice);
  }, []);

  function confirmCloud(name: string): Promise<boolean> {
    if (hasCloudConsent()) return Promise.resolve(true);
    return new Promise((resolve) =>
      Alert.alert(
        `Send tutor requests to ${name}?`,
        'With a cloud tutor, your typed and spoken answers, chat messages, and the lesson content they relate to are sent to the AI service to generate feedback. Your progress and recordings stay on this phone. You can switch back to on-device AI any time.',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
          {
            text: 'Agree',
            onPress: () => {
              setCloudConsent(true);
              resolve(true);
            },
          },
        ]
      )
    );
  }

  async function choose(next: AiProvider) {
    if (next !== 'device' && !(await confirmCloud(next === 'plus' ? 'Hablo Plus' : 'OpenRouter'))) return;
    setAiProvider(next);
    setProvider(next);
    await getAvailability(true);
  }

  return (
    <Screen edges={['bottom']}>
      <Text variant="body" color="textSecondary">
        The tutor runs role-plays, grades free answers, answers grammar questions, and writes reading passages. Lessons
        work without it.
      </Text>
      {status ? (
        <Card tone={status.status === 'available' ? 'successSoft' : 'warningSoft'}>
          <Row>
            <Icon
              name={status.status === 'available' ? Icons.checkCircle : Icons.warning}
              color={status.status === 'available' ? 'success' : 'warning'}
            />
            <Text variant="bodyStrong" style={styles.flex}>
              {status.status === 'available' ? `Using ${status.label}` : `${status.label} isn't ready`}
            </Text>
          </Row>
          {status.reason && status.status !== 'available' ? <Text variant="caption">{status.reason}</Text> : null}
          {status.notice ? <Text variant="caption">{status.notice}</Text> : null}
        </Card>
      ) : null}

      <Option
        selected={provider === 'device'}
        title="On-device"
        badge="Free · private"
        detail="Apple Intelligence or Gemini Nano. Works offline and nothing leaves your phone. Smaller model: good for practice, weaker at nuance."
        onSelect={() => choose('device')}>
        <DeviceStatus device={device} onChange={setDevice} />
      </Option>

      <Option
        selected={provider === 'openrouter'}
        title="Your OpenRouter key"
        badge="Pay per use"
        detail="Bring your own OpenRouter account and pick any model. DeepSeek costs roughly a cent per session."
        onSelect={() => choose('openrouter')}>
        <OpenRouterSetup active={provider === 'openrouter'} />
      </Option>

      <Option
        selected={provider === 'plus'}
        title="Hablo Plus"
        badge="Subscription"
        detail="A smarter hosted tutor model for a small monthly price. No account or API key needed."
        disabled={!plusAvailableInBuild()}
        onSelect={() => choose('plus')}>
        <PlusPanel />
      </Option>
    </Screen>
  );
}

function Option({
  selected,
  title,
  badge,
  detail,
  disabled,
  onSelect,
  children,
}: {
  selected: boolean;
  title: string;
  badge: string;
  detail: string;
  disabled?: boolean;
  onSelect: () => void;
  children?: ReactNode;
}) {
  const theme = useTheme();
  return (
    <Card style={[styles.option, selected && { borderColor: theme.primary, borderWidth: 2 }]}>
      <Pressable
        accessibilityRole="radio"
        accessibilityState={{ selected, disabled }}
        disabled={disabled}
        onPress={onSelect}
        style={styles.optionHeader}>
        <View style={[styles.radio, { borderColor: selected ? theme.primary : theme.border }]}>
          {selected ? <View style={[styles.radioDot, { backgroundColor: theme.primary }]} /> : null}
        </View>
        <View style={styles.flex}>
          <Row>
            <Text variant="bodyStrong" color={disabled ? 'textTertiary' : 'text'}>
              {title}
            </Text>
            <Pill label={badge} tone={selected ? 'primary' : 'accent'} />
          </Row>
          <Text variant="caption">{detail}</Text>
        </View>
      </Pressable>
      {children}
    </Card>
  );
}

function DeviceStatus({ device, onChange }: { device: LlmAvailability | null; onChange: (d: LlmAvailability) => void }) {
  const [preparing, setPreparing] = useState(false);
  if (!device) return null;
  return (
    <View style={styles.panel}>
      <Text variant="caption" color={device.status === 'available' ? 'success' : 'textSecondary'}>
        {device.status === 'available' ? `${device.label} is ready on this device.` : device.reason ?? 'Unavailable.'}
      </Text>
      {device.status !== 'available' && device.backend !== 'none' ? (
        <Button
          label="Download / prepare model"
          variant="secondary"
          size="sm"
          loading={preparing}
          onPress={async () => {
            setPreparing(true);
            try {
              await prepareModel();
              onChange(await getDeviceAvailability(true));
            } catch (e) {
              Alert.alert('Could not prepare the model', String(e));
            } finally {
              setPreparing(false);
            }
          }}
        />
      ) : null}
    </View>
  );
}

function OpenRouterSetup({ active }: { active: boolean }) {
  const [key, setKey] = useState('');
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [model, setModel] = useState(openRouterModel);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    loadOpenRouterKey().then(setSavedKey);
  }, []);

  async function save() {
    const candidate = key.trim() || savedKey;
    if (!candidate) return;
    setTesting(true);
    const problem = await testOpenRouter(candidate, model);
    setTesting(false);
    if (problem) {
      Alert.alert("That didn't work", problem);
      return;
    }
    await saveOpenRouterKey(candidate);
    setOpenRouterModel(model);
    setSavedKey(candidate);
    setKey('');
    await getAvailability(true);
    Alert.alert('Connected', `Using ${model}.`);
  }

  async function removeKey() {
    await saveOpenRouterKey(null);
    setSavedKey(null);
    await getAvailability(true);
  }

  return (
    <View style={styles.panel}>
      <Input
        value={key}
        onChangeText={setKey}
        placeholder={savedKey ? `Key saved (…${savedKey.slice(-4)})` : 'sk-or-… API key'}
        secureTextEntry
        autoComplete="off"
      />
      <Text variant="caption">Model</Text>
      <Row style={styles.wrap}>
        {MODEL_PRESETS.map((m) => (
          <Chip key={m.id} label={m.label} selected={model === m.id} onPress={() => setModel(m.id)} />
        ))}
      </Row>
      <Input value={model} onChangeText={setModel} placeholder="provider/model-id" />
      <Text variant="caption">
        {MODEL_PRESETS.find((m) => m.id === model)?.detail ?? 'Any OpenRouter model id works; JSON-capable chat models do best.'}
      </Text>
      <Row style={styles.wrap}>
        <Button
          label={savedKey && !key ? 'Save model' : 'Test & save'}
          size="sm"
          loading={testing}
          disabled={!key.trim() && !savedKey}
          onPress={save}
        />
        {savedKey ? <Button label="Remove key" size="sm" variant="ghost" onPress={removeKey} /> : null}
      </Row>
      {!active && savedKey ? <Text variant="caption">Select this option above to start using it.</Text> : null}
      <Text variant="caption" color="textTertiary">
        Get a key at openrouter.ai/keys. It&apos;s stored in this device&apos;s secure keychain and only sent to OpenRouter.
      </Text>
    </View>
  );
}

function PlusPanel() {
  const [active, setActive] = useState(isPlusActive);
  const [packages, setPackages] = useState<PurchasesPackage[] | null>(null);
  const [busy, setBusy] = useState(false);
  const available = plusAvailableInBuild();

  useEffect(() => {
    if (!available) return;
    const unsubscribe = subscribePlus(() => setActive(isPlusActive()));
    plusPackages()
      .then(setPackages)
      .catch(() => setPackages([]));
    return unsubscribe;
  }, [available]);

  if (!available) {
    return (
      <Text variant="caption" style={styles.panel}>
        Not available in this build yet.
      </Text>
    );
  }

  async function run(action: () => Promise<boolean>, success: string) {
    setBusy(true);
    try {
      if (await action()) {
        Alert.alert('Hablo Plus', success);
        await getAvailability(true);
      }
    } catch (e) {
      Alert.alert('Something went wrong', e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.panel}>
      {active ? (
        <Text variant="caption" color="success">
          Your subscription is active. Manage or cancel it in your App Store / Google Play account settings.
        </Text>
      ) : packages === null ? (
        <Text variant="caption">Loading plans…</Text>
      ) : packages.length ? (
        packages.map((pkg) => (
          <Button
            key={pkg.identifier}
            label={`Subscribe · ${pkg.product.priceString}${pkg.product.subscriptionPeriod === 'P1M' ? '/month' : ''}`}
            size="sm"
            loading={busy}
            onPress={() => run(() => buyPlus(pkg), 'Welcome to Plus! Select it above to start using it.')}
          />
        ))
      ) : (
        <Text variant="caption">Plans couldn&apos;t be loaded. Check your connection.</Text>
      )}
      {!active ? (
        <Button
          label="Restore purchases"
          size="sm"
          variant="ghost"
          disabled={busy}
          onPress={() => run(restorePlus, 'Your subscription was restored.')}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  option: { gap: Spacing.two },
  optionHeader: { flexDirection: 'row', gap: Spacing.three, alignItems: 'flex-start' },
  radio: {
    width: 22,
    height: 22,
    borderRadius: Radius.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioDot: { width: 10, height: 10, borderRadius: Radius.pill },
  panel: { gap: Spacing.two, paddingLeft: 22 + Spacing.three },
  wrap: { flexWrap: 'wrap', gap: Spacing.two },
});
