import { runGuardrailClassifier } from '@/app/lib/callOai';

export const moderationGuardrail = {
  name: 'moderation_guardrail',
  async execute({ agentOutput }: { agentOutput: string }) {
    try {
      const res = await runGuardrailClassifier(agentOutput);
      const triggered = res.moderationCategory !== 'NONE';
      return {
        tripwireTriggered: triggered,
        outputInfo: res,
      };
    } catch (err) {
      console.error('Guardrail check failed:', err);
      return {
        tripwireTriggered: false,
        outputInfo: { error: 'guardrail_failed' },
      };
    }
  },
};
