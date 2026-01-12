import { useState } from 'react';
import {
    KnowledgeBaseContent,
    Risk,
    TechnicalSpecs
} from '@/types/knowledgeBase.types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RiskImpact, RiskProbability } from '@/types/knowledgeBase.types';
import { RichTextEditor } from '@/components/rtm/RichTextEditor';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from '@/components/ui/input';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DependenciesPanel } from './DependenciesPanel';
import { TestCasesTable } from './TestCasesTable';

interface StructuredPanelsProps {
    content: KnowledgeBaseContent;
    onChange: (updates: Partial<KnowledgeBaseContent>) => void;
    readOnly?: boolean;
}

export const StructuredPanels = ({ content, onChange, readOnly = false }: StructuredPanelsProps) => {

    const handleACChange = (value: string) => {
        onChange({ acceptanceCriteria: value });
    };

    const handleTechSpecChange = (field: keyof TechnicalSpecs, value: string) => {
        onChange({
            technicalSpecs: {
                ...content.technicalSpecs,
                [field]: value
            }
        });
    };

    const handleRiskChange = (updates: Risk[]) => {
        onChange({ risks: updates });
    };

    return (
        <Accordion type="multiple" defaultValue={["ac", "tech", "test", "dep", "risk"]} className="w-full space-y-4">

            {/* Acceptance Criteria */}
            <AccordionItem value="ac" className="border rounded-lg px-4 bg-white/50">
                <AccordionTrigger className="hover:no-underline py-4">
                    <span className="font-semibold text-base">Acceptance Criteria</span>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 space-y-3">
                    <div className="space-y-4">
                        <RichTextEditor
                            value={typeof content.acceptanceCriteria === 'string' ? content.acceptanceCriteria : ''}
                            onChange={handleACChange}
                            readOnly={readOnly}
                            minHeight="min-h-[150px]"
                            placeholder="Define the conditions that must be met for this requirement to be considered complete..."
                        />
                    </div>
                </AccordionContent>
            </AccordionItem>

            {/* Technical Specs */}
            <AccordionItem value="tech" className="border rounded-lg px-4 bg-white/50">
                <AccordionTrigger className="hover:no-underline py-4">
                    <span className="font-semibold text-base">Technical Specifications</span>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 space-y-4">
                    {content.technicalSpecs && (
                        <div className="grid gap-4">
                            <div>
                                <label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 block">API Endpoints</label>
                                <RichTextEditor
                                    value={content.technicalSpecs.apiEndpoints || ''}
                                    onChange={(value) => handleTechSpecChange('apiEndpoints', value)}
                                    readOnly={readOnly}
                                    minHeight="min-h-[80px]"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 block">Data Models</label>
                                <RichTextEditor
                                    value={content.technicalSpecs.dataModels || ''}
                                    onChange={(value) => handleTechSpecChange('dataModels', value)}
                                    readOnly={readOnly}
                                    minHeight="min-h-[80px]"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 block">Integration Points</label>
                                <RichTextEditor
                                    value={content.technicalSpecs.integrationPoints || ''}
                                    onChange={(value) => handleTechSpecChange('integrationPoints', value)}
                                    readOnly={readOnly}
                                    minHeight="min-h-[60px]"
                                />
                            </div>
                        </div>
                    )}
                </AccordionContent>
            </AccordionItem>

            {/* Dependencies */}
            <AccordionItem value="dep" className="border rounded-lg px-4 bg-white/50">
                <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-base">Dependencies</span>
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-medium">
                            {(content.dependencies || []).length}
                        </span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                    <DependenciesPanel
                        dependencies={content.dependencies || []}
                        onChange={(deps) => onChange({ dependencies: deps })}
                        readOnly={readOnly}
                    />
                </AccordionContent>
            </AccordionItem>

            {/* Test Cases */}
            <AccordionItem value="test" className="border rounded-lg px-4 bg-white/50">
                <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-base">Test Cases</span>
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-medium">
                            {(content.testCases || []).length}
                        </span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                    <TestCasesTable
                        testCases={content.testCases || []}
                        onChange={(tcs) => onChange({ testCases: tcs })}
                        readOnly={readOnly}
                    />
                </AccordionContent>
            </AccordionItem>

            {/* Risks */}
            <AccordionItem value="risk" className="border rounded-lg px-4 bg-white/50">
                <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-base">Risk Assessment</span>
                        {(content.risks || []).length > 0 && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                    <div className="rounded-md border mb-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Impact</TableHead>
                                    <TableHead>Mitigation</TableHead>
                                    {!readOnly && <TableHead className="w-[50px]"></TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(content.risks || []).length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={readOnly ? 3 : 4} className="text-center text-muted-foreground h-20">
                                            No risks identified.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    (content.risks || []).map((risk, idx) => (
                                        <TableRow key={risk.id}>
                                            <TableCell className="font-medium align-top">
                                                {readOnly ? risk.description : (
                                                    <Input
                                                        value={risk.description}
                                                        onChange={(e) => {
                                                            const newRisks = [...(content.risks || [])];
                                                            newRisks[idx] = { ...risk, description: e.target.value };
                                                            handleRiskChange(newRisks);
                                                        }}
                                                        className="h-8"
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell className="align-top">
                                                <Badge variant="outline" className={risk.impact === 'high' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-100'}>
                                                    {risk.impact}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground align-top">
                                                {readOnly ? risk.mitigation : (
                                                    <Input
                                                        value={risk.mitigation}
                                                        onChange={(e) => {
                                                            const newRisks = [...(content.risks || [])];
                                                            newRisks[idx] = { ...risk, mitigation: e.target.value };
                                                            handleRiskChange(newRisks);
                                                        }}
                                                        className="h-8"
                                                    />
                                                )}
                                            </TableCell>
                                            {!readOnly && (
                                                <TableCell className="align-top">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={() => {
                                                        const newRisks = [...(content.risks || [])];
                                                        newRisks.splice(idx, 1);
                                                        handleRiskChange(newRisks);
                                                    }}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    {!readOnly && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const newRisks = [...(content.risks || []), {
                                    id: `r-${Date.now()}`,
                                    description: 'New Risk',
                                    impact: 'low' as RiskImpact,
                                    probability: 'low' as RiskProbability,
                                    mitigation: 'Monitor'
                                }];
                                handleRiskChange(newRisks);
                            }}
                        >
                            <Plus className="h-3.5 w-3.5 mr-2" />
                            Add Risk
                        </Button>
                    )}
                </AccordionContent>
            </AccordionItem>

        </Accordion>
    );
};
