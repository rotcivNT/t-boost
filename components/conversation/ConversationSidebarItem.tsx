import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface IProps {
  title: string;
  children?: React.ReactNode;
}

function ConversationSidebarItem({ title, children }: IProps) {
  return (
    <div className="mt-4">
      <Accordion type="single" collapsible defaultValue={title}>
        <AccordionItem className="border-none" value={title}>
          <AccordionTrigger className="hover:bg-[rgba(33,36,40,0.4)] py-[2px] text-sm font-[400] px-3 flex-row-reverse justify-end gap-3 text-[#B9BABD] hover:border-none hover:no-underline">
            {title}
          </AccordionTrigger>
          <AccordionContent className="pb-0 flex flex-col gap-[1px]">
            {children}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div></div>
    </div>
  );
}

export default ConversationSidebarItem;
